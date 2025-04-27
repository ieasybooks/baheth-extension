// settings
export const default_settings = {
  auto_redirect: false,
  notification_display_time: 10, // in seconds (min: 3, max: 60)
  found_videos_count: 0,
};

// api endpoints
export const API_BASE_URL = "https://baheth.ieasybooks.com/api";
export const API_MEDIA_INFO_URL =
  API_BASE_URL + "/media?reference_id=REFERENCE_ID&reference_type=youtube_link";

export const API_PLAYLIST_INFO_URL =
  API_BASE_URL +
  "/playlists?reference_id=REFERENCE_ID&reference_type=youtube_link";
