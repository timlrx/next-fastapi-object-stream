import { useState, useCallback } from "react";

interface StreamJsonOptions<T> {
  url: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: any;
  onChunk?: (chunk: T) => void;
}

export function useStreamJson<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const streamJson = useCallback(
    async ({
      url,
      method = "POST",
      headers = {},
      body,
      onChunk,
    }: StreamJsonOptions<T>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        let buffer = "";
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          let startIndex = 0;
          while (true) {
            const endIndex = buffer.indexOf("}", startIndex);
            if (endIndex === -1) break;

            try {
              const jsonStr = buffer.slice(startIndex, endIndex + 1);
              const parsedChunk = JSON.parse(jsonStr);
              if (parsedChunk && onChunk) {
                onChunk(parsedChunk as T);
              }
              startIndex = endIndex + 1;
            } catch (error) {
              startIndex++;
            }
          }
          buffer = buffer.slice(startIndex);
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { streamJson, isLoading, error };
}
