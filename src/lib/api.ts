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

// Timeout for fetch requests in milliseconds
const FETCH_TIMEOUT = 10000;
// Maximum number of retries for API calls
const MAX_RETRIES = 2;
// Delay between retries in milliseconds
const RETRY_DELAY = 1000;

/**
 * Wraps a fetch request with timeout functionality
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * A retry wrapper for API calls
 */
async function fetchWithRetry<T>(
  fetchFunction: () => Promise<T>, 
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fetchFunction();
    } catch (error) {
      console.warn(`API call failed (attempt ${i + 1}/${maxRetries + 1}):`, error);
      lastError = error;
      
      if (i < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  
  throw lastError;
}

export async function get_baheth_media_info(
  reference_id: string
): Promise<BahethVideoInfo | undefined> {
  const request_url = API_MEDIA_INFO_URL.replace(
    "REFERENCE_ID",
    encodeURIComponent(reference_id)
  );

  return fetchWithRetry(async () => {
    try {
      const response = await fetchWithTimeout(request_url, {
        headers: {
          Accept: "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching media info:", error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network connection error');
      }
      throw error;
    }
  });
}

export async function get_baheth_playlist_info(
  reference_id: string
): Promise<BahethVideoInfo | undefined> {
  const request_url = API_PLAYLIST_INFO_URL.replace(
    "REFERENCE_ID",
    encodeURIComponent(reference_id)
  );

  return fetchWithRetry(async () => {
    try {
      const response = await fetchWithTimeout(request_url, {
        headers: {
          Accept: "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching playlist info:", error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network connection error');
      }
      throw error;
    }
  });
}
