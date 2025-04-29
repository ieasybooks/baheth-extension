// settings
export const default_settings = {
  auto_redirect: false,
  found_videos_count: 0,
  notification_timeout: 6000, // Default timeout in milliseconds (6 seconds)
  auto_check: true,
};

// api endpoints
export const API_BASE_URL = "https://baheth.ieasybooks.com/api";
export const API_MEDIA_INFO_URL =
  API_BASE_URL + "/media?reference_id=REFERENCE_ID&reference_type=youtube_link";

export const API_PLAYLIST_INFO_URL =
  API_BASE_URL +
  "/playlists?reference_id=REFERENCE_ID&reference_type=youtube_link";
