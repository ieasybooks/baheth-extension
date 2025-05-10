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

export async function get_baheth_media_info(
  reference_id: string,
  with_transcription: boolean = false
): Promise<BahethVideoInfo | undefined> {
  const request_url = API_MEDIA_INFO_URL.replace(
    "REFERENCE_ID",
    encodeURIComponent(reference_id)
  ).replace("WITH_TRANSCRIPTION", String(with_transcription))

  const data = await fetch(request_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .catch(() => { });

  return data;
}

export async function get_baheth_playlist_info(
  reference_id: string
): Promise<BahethVideoInfo | undefined> {
  const request_url = API_PLAYLIST_INFO_URL.replace(
    "REFERENCE_ID",
    encodeURIComponent(reference_id)
  );

  const data = await fetch(request_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .catch(() => { });

  return data;
}
