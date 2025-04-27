// Gets the current platform type
export function get_platform_type(): "youtube" | "unknown" {
  const host = window.location.hostname;
  if (host.includes("youtube.com")) {
    return "youtube";
  } else {
    return "unknown";
  }
}

// Extracts clean URL from current location based on platform
export function get_clean_video_url() {
  const platform = get_platform_type();
  
  switch (platform) {
    case "youtube":
      return get_clean_youtube_url();
    default:
      return null;
  }
}

// YouTube specific URL cleaner
export function get_clean_youtube_url() {
  // match video/playlist id
  const match = location.href.match(/(?:\/watch\?v=|\/playlist\?list=)([^&]+)/);

  // get page type
  const page_type = get_youtube_page_type(location.href);

  if (!match || page_type === "unknown") return null;

  // video/playlist id
  const id = match[1];

  // id search param name
  const id_param = page_type === "video" ? "v" : "list";

  // return the clean url
  return `${location.origin}${location.pathname}?${id_param}=${id}`;
}

// Gets page type based on URL format
export function get_page_type(url: string): "video" | "playlist" | "unknown" {
  const platform = get_platform_type();
  
  switch (platform) {
    case "youtube":
      return get_youtube_page_type(url);
    default:
      return "unknown";
  }
}

export function get_youtube_page_type(
  url: string
): "video" | "playlist" | "unknown" {
  if (url.includes("/watch?v=")) {
    return "video";
  } else if (url.includes("/playlist?list=")) {
    return "playlist";
  } else {
    return "unknown";
  }
}
