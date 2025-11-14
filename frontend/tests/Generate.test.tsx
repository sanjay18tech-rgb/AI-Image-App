import { describe, expect, beforeAll, beforeEach, afterAll, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Studio from "../src/components/Studio";
import type { GenerationRecord } from "../src/hooks/useGenerate";

const mockGenerate = vi.fn();
const mockAbort = vi.fn();
const mockResetError = vi.fn();

const baseState = {
  generate: mockGenerate,
  abort: mockAbort,
  resetError: mockResetError,
  isGenerating: false,
  error: null as string | null,
  history: [] as GenerationRecord[],
  attemptNumber: 0,
  attemptsRemaining: 3,
  maxAttempts: 3,
  buildAssetUrl: (path: string) => path,
};

vi.mock("../src/hooks/useGenerate", () => ({
  useGenerate: () => baseState,
}));

vi.stubGlobal(
  "fetch",
  vi.fn(async () => ({
    blob: async () => new Blob(["test"], { type: "image/png" }),
  })) as unknown as typeof fetch,
);

const originalCreateObjectUrl = globalThis.URL?.createObjectURL;
const originalRevokeObjectUrl = globalThis.URL?.revokeObjectURL;

beforeAll(() => {
  Object.assign(globalThis.URL, {
    createObjectURL: vi.fn(() => "blob:local"),
    revokeObjectURL: vi.fn(),
  });
});

afterAll(() => {
  Object.assign(globalThis.URL, {
    createObjectURL: originalCreateObjectUrl,
    revokeObjectURL: originalRevokeObjectUrl,
  });
});

describe("Studio UI", () => {
  beforeEach(() => {
    Object.assign(baseState, {
      generate: mockGenerate,
      abort: mockAbort,
      resetError: mockResetError,
      isGenerating: false,
      error: null,
      history: [],
      attemptNumber: 0,
      attemptsRemaining: 3,
      maxAttempts: 3,
      buildAssetUrl: (path: string) => path,
    });
    mockGenerate.mockReset().mockResolvedValue({
      id: "gen-1",
      prompt: "Prompt",
      style: "Editorial",
      imageUrl: "/uploads/test.png",
      createdAt: new Date().toISOString(),
      status: "completed",
    });
    mockAbort.mockReset();
    mockResetError.mockReset();
    (fetch as unknown as vi.Mock).mockClear();
  });

  it("renders prompt, style, and upload controls", () => {
    render(<Studio />);

    expect(screen.getByLabelText(/design style/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/color theme/i)).toBeInTheDocument();
    expect(screen.getByText(/reference image/i)).toBeInTheDocument();
    expect(screen.getAllByText(/write prompt/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /generate fashion design/i })).toBeDisabled();
  });

  it("enables retry after a successful generation", async () => {
    const { container } = render(<Studio />);

    const fileInput = container.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File([new ArrayBuffer(10)], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const promptField = screen.getByLabelText(/write prompt/i);
    fireEvent.change(promptField, { target: { value: "Streetwear inspired look" } });

    const generateButton = screen.getByRole("button", { name: /generate fashion design/i });
    fireEvent.click(generateButton);

    await waitFor(() => expect(mockGenerate).toHaveBeenCalled());

    const retryButton = screen.getByRole("button", { name: /retry last generation/i });
    expect(retryButton).toBeEnabled();
  });

  it("shows stop generation button when a generation is in progress", () => {
    baseState.isGenerating = true;
    render(<Studio />);

    expect(screen.getByRole("button", { name: /stop generation/i })).toBeEnabled();
  });

  it("restores a previous generation when clicked", async () => {
    const createdAt = new Date().toISOString();
    baseState.history = [
      {
        id: "gen-history",
        prompt: "Restorable prompt",
        style: "Runway",
        imageUrl: "/uploads/history.png",
        status: "completed",
        createdAt,
      },
    ];

    render(<Studio />);

    const card = await screen.findByText(/restorable prompt/i);
    fireEvent.click(card);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await screen.findByText(/generation restored/i);
  });
});
