import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, beforeEach, afterEach, it, vi } from "vitest";
import type { AxiosError } from "axios";
import { useGenerate } from "../src/hooks/useGenerate";

const mockGet = vi.fn();
const mockPost = vi.fn();

vi.mock("../src/lib/api", () => ({
  api: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
    interceptors: { request: { use: vi.fn() } },
  },
  buildAssetUrl: (path: string) => path,
}));

vi.mock("../src/hooks/useRetry", () => ({
  useRetry: ({ maxAttempts }: { maxAttempts: number }) => ({
    runWithRetry: async <T>(
      fn: () => Promise<T>,
      callbacks: { shouldRetry?: (err: unknown) => boolean; onAttempt?: (attempt: number) => void } = {},
    ): Promise<T> => {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        callbacks.onAttempt?.(attempt);
        try {
          return await fn();
        } catch (error) {
          const retry = callbacks.shouldRetry?.(error);
          if (!retry || attempt === maxAttempts) {
            throw error;
          }
        }
      }
      throw new Error("Retry exhausted");
    },
  }),
}));

describe("useGenerate hook", () => {
  beforeEach(() => {
    mockGet.mockResolvedValue({ data: { data: [] } });
    mockPost.mockReset();
  });

  afterEach(() => {
    mockPost.mockReset();
  });

  it("loads history on mount", async () => {
    const historyRecord = {
      id: "history-1",
      prompt: "Existing",
      style: "Editorial",
      imageUrl: "/uploads/history.png",
      status: "completed",
      createdAt: new Date().toISOString(),
    };
    mockGet.mockResolvedValueOnce({ data: { data: [historyRecord] } });

    const { result } = renderHook(() => useGenerate());

    await waitFor(() => expect(result.current.history).toHaveLength(1));
    expect(result.current.history[0]).toMatchObject(historyRecord);
  });

  it("uploads a generation and updates history", async () => {
    const record = {
      id: "gen-1",
      prompt: "A modern runway look",
      style: "Runway",
      imageUrl: "/uploads/gen-1.png",
      status: "completed",
      createdAt: new Date().toISOString(),
    };
    mockPost.mockResolvedValueOnce({ data: record });

    const { result } = renderHook(() => useGenerate());
    await waitFor(() => expect(mockGet).toHaveBeenCalled());

    const file = new File([new ArrayBuffer(10)], "reference.png", { type: "image/png" });

    await act(async () => {
      const response = await result.current.generate({ prompt: record.prompt, style: record.style, image: file });
      expect(response).toMatchObject(record);
    });

    expect(result.current.history[0]).toMatchObject(record);
    expect(result.current.isGenerating).toBe(false);
  });

  it("retries up to three times when the model is overloaded", async () => {
    const overloadError = {
      isAxiosError: true,
      response: { status: 503 },
    } as AxiosError;

    const record = {
      id: "gen-retry",
      prompt: "Retry look",
      style: "Streetwear",
      imageUrl: "/uploads/retry.png",
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    mockPost
      .mockRejectedValueOnce(overloadError)
      .mockResolvedValueOnce({ data: record });

    const { result } = renderHook(() => useGenerate());
    await waitFor(() => expect(mockGet).toHaveBeenCalled());

    const file = new File([new ArrayBuffer(10)], "retry.png", { type: "image/png" });

    await act(async () => {
      await result.current.generate({ prompt: record.prompt, style: record.style, image: file });
    });

    expect(mockPost).toHaveBeenCalledTimes(2);
    expect(result.current.attemptNumber).toBeGreaterThanOrEqual(2);
    expect(result.current.history[0]).toMatchObject(record);
  });

  it("aborts in-flight requests", async () => {
    mockPost.mockImplementation((_, __, config?: { signal?: AbortSignal }) => {
      return new Promise((_resolve, reject) => {
        config?.signal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    });

    const { result } = renderHook(() => useGenerate());
    await waitFor(() => expect(mockGet).toHaveBeenCalled());

    const file = new File([new ArrayBuffer(10)], "abort.png", { type: "image/png" });

    await act(async () => {
      const generationPromise = result.current.generate({ prompt: "Abort", style: "Editorial", image: file }).catch((err) => err);
      result.current.abort();
      await generationPromise;
    });

    expect(result.current.error).toMatch(/aborted/i);
    expect(result.current.isGenerating).toBe(false);
  });
});
