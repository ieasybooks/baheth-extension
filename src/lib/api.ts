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

/**
 * Wraps a fetch request with timeout functionality
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  
  clearTimeout(id);
  return response;
}

export async function get_baheth_media_info(
  reference_id: string
): Promise<BahethVideoInfo | undefined> {
  const request_url = API_MEDIA_INFO_URL.replace(
    "REFERENCE_ID",
    encodeURIComponent(reference_id)
  );

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
    }
    throw error;
  }
}

export async function get_baheth_playlist_info(
  reference_id: string
): Promise<BahethVideoInfo | undefined> {
  const request_url = API_PLAYLIST_INFO_URL.replace(
    "REFERENCE_ID",
    encodeURIComponent(reference_id)
  );

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
    }
    throw error;
  }
}
