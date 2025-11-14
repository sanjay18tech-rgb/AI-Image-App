import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { api, buildAssetUrl } from "../lib/api";
import { useRetry } from "./useRetry";

export type GenerationRecord = {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
  status: string;
  createdAt: string;
};

export type GeneratePayload = {
  prompt: string;
  style: string;
  image: File;
};

const MAX_ATTEMPTS = 3;

const isAbortError = (error: unknown) => {
  if (axios.isCancel(error)) {
    return true;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return true;
  }

  return false;
};

export const useGenerate = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationRecord[]>([]);
  const [attemptNumber, setAttemptNumber] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(MAX_ATTEMPTS);
  const lastAttemptRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const { runWithRetry } = useRetry({ maxAttempts: MAX_ATTEMPTS, baseDelay: 500 });

  const fetchHistory = useCallback(async () => {
    try {
      const response = await api.get<{ data: GenerationRecord[] }>("/generations", {
        params: { limit: 5 },
      });
      setHistory(response.data.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        return;
      }
      console.error("Failed to load history", err);
    }
  }, []);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  const generate = useCallback(
    async (payload: GeneratePayload) => {
      setError(null);
      setAttemptNumber(0);
      setAttemptsRemaining(MAX_ATTEMPTS);
      lastAttemptRef.current = 0;
      setIsGenerating(true);

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const result = await runWithRetry(
          async () => {
            const formData = new FormData();
            formData.append("prompt", payload.prompt);
            formData.append("style", payload.style);
            formData.append("image", payload.image);

            const response = await api.post("/generations", formData, {
              headers: { "Content-Type": "multipart/form-data" },
              signal: controller.signal,
            });

            return response.data as GenerationRecord;
          },
          {
            shouldRetry: (err) => {
              if (isAbortError(err)) {
                return false;
              }

              if (axios.isAxiosError(err)) {
                return err.response?.status === 503;
              }

              return false;
            },
            onAttempt: (attempt) => {
              lastAttemptRef.current = attempt;
              setAttemptNumber(attempt);
              setAttemptsRemaining(Math.max(MAX_ATTEMPTS - attempt, 0));
            },
          },
        );

        setHistory((prev) => {
          const next = [result, ...prev.filter((item) => item.id !== result.id)];
          return next.slice(0, 5);
        });

        return result;
      } catch (err) {
        if (isAbortError(err)) {
          setError("Generation aborted");
        } else if (axios.isAxiosError(err)) {
          if (err.response?.status === 503) {
            setError("Model overloaded. Please retry in a moment");
          } else if (err.response?.data?.message) {
            setError(err.response.data.message as string);
          } else {
            setError("Unexpected API error. Please try again");
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unexpected error");
        }

        throw err;
      } finally {
        controllerRef.current = null;
        setIsGenerating(false);
        if (lastAttemptRef.current === 0) {
          setAttemptsRemaining(MAX_ATTEMPTS);
        }
      }
    },
    [runWithRetry],
  );

  const abort = useCallback(() => {
    const controller = controllerRef.current;
    if (controller) {
      controller.abort();
    }
    controllerRef.current = null;
    setIsGenerating(false);
    setAttemptNumber(0);
    setAttemptsRemaining(MAX_ATTEMPTS);
    lastAttemptRef.current = 0;
  }, []);

  const resetError = useCallback(() => setError(null), []);

  return {
    generate,
    abort,
    resetError,
    isGenerating,
    error,
    history,
    attemptNumber,
    attemptsRemaining,
    maxAttempts: MAX_ATTEMPTS,
    reloadHistory: fetchHistory,
    buildAssetUrl,
  };
};

