import { API_MEDIA_INFO_URL, API_PLAYLIST_INFO_URL } from "./constants";

export type BahethVideoInfo = {
  title: string;
  description: string;
  duration: number;
  link: string;
  source_link: string;
  transcription_txt_link: string;
  transcription_srt_link: string;
  transcription_pdf_link: string;
  transcription_epub_link: string;
};

export type ApiError = {
  message: string;
  status?: number;
  isRetryable: boolean;
};

/**
 * Centralized fetch wrapper with error handling, timeout, and retry capability
 */
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 2,
  timeout = 10000
): Promise<{ data?: T; error?: ApiError }> {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  // Merge options with abort signal
  const fetchOptions: RequestInit = {
    ...options,
    signal: controller.signal,
  };
  
  let retries = 0;
  let lastError: ApiError | undefined;
  
  while (retries <= maxRetries) {
    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const error: ApiError = {
          message: `API request failed with status ${response.status}`,
          status: response.status,
          isRetryable: response.status >= 500 || response.status === 429
        };
        
        if (!error.isRetryable || retries === maxRetries) {
          return { error };
        }
        
        lastError = error;
      } else {
        const data = await response.json() as T;
        return { data };
      }
    } catch (err) {
      clearTimeout(timeoutId);
      
      const isTimeout = err instanceof DOMException && err.name === "AbortError";
      const isNetworkError = err instanceof TypeError && err.message.includes("fetch");
      
      lastError = {
        message: isTimeout ? "Request timed out" : `Request failed: ${err instanceof Error ? err.message : String(err)}`,
        isRetryable: isTimeout || isNetworkError
      };
      
      if (!lastError.isRetryable || retries === maxRetries) {
        return { error: lastError };
      }
    }
    
    // Exponential backoff: 300ms, 900ms, 2700ms, etc.
    const backoffTime = 300 * Math.pow(3, retries);
    await new Promise(resolve => setTimeout(resolve, backoffTime));
    retries++;
  }
  
  return { error: lastError };
}

export async function get_baheth_media_info(
  reference_id: string
): Promise<BahethVideoInfo | undefined> {
  const request_url = API_MEDIA_INFO_URL.replace(
    "REFERENCE_ID",
    encodeURIComponent(reference_id)
  );

  const { data, error } = await fetchWithRetry<BahethVideoInfo>(request_url, {
    headers: {
      Accept: "application/json",
    },
  });
  
  if (error) {
    console.error("Error fetching media info:", error.message);
  }
  
  return data;
}

export async function get_baheth_playlist_info(
  reference_id: string
): Promise<BahethVideoInfo | undefined> {
  const request_url = API_PLAYLIST_INFO_URL.replace(
    "REFERENCE_ID",
    encodeURIComponent(reference_id)
  );

  const { data, error } = await fetchWithRetry<BahethVideoInfo>(request_url, {
    headers: {
      Accept: "application/json",
    },
  });
  
  if (error) {
    console.error("Error fetching playlist info:", error.message);
  }
  
  return data;
}
