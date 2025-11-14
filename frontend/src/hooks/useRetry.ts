type RetryOptions = {
  maxAttempts: number;
  baseDelay: number;
};

type RetryCallbacks = {
  shouldRetry?: (error: unknown) => boolean;
  onAttempt?: (attempt: number) => void;
};

export const useRetry = ({ maxAttempts, baseDelay }: RetryOptions) => {
  const runWithRetry = async <T>(
    fn: () => Promise<T>,
    callbacks: RetryCallbacks = {},
  ): Promise<T> => {
    const { shouldRetry, onAttempt } = callbacks;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      onAttempt?.(attempt);

      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }

        if (shouldRetry && !shouldRetry(error)) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error("Retry exhausted");
  };

  return { runWithRetry };
};

