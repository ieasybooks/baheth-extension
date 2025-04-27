// Gets the current platform type
export function get_platform_type(): "youtube" | "dailymotion" | "vimeo" | "unknown" {
  const host = window.location.hostname;
  if (host.includes("youtube.com")) {
    return "youtube";
  } else if (host.includes("dailymotion.com")) {
    return "dailymotion";
  } else if (host.includes("vimeo.com")) {
    return "vimeo";
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
    case "dailymotion":
      return get_clean_dailymotion_url();
    case "vimeo":
      return get_clean_vimeo_url();
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

// Dailymotion specific URL cleaner
export function get_clean_dailymotion_url() {
  const match = location.href.match(/\/video\/([^?#]+)/);
  if (!match) return null;
  
  return `${location.origin}/video/${match[1]}`;
}

// Vimeo specific URL cleaner
export function get_clean_vimeo_url() {
  const match = location.href.match(/vimeo\.com\/(\d+)/);
  if (!match) return null;
  
  return `${location.origin}/${match[1]}`;
}

// Gets page type based on URL format
export function get_page_type(url: string): "video" | "playlist" | "unknown" {
  const platform = get_platform_type();
  
  switch (platform) {
    case "youtube":
      return get_youtube_page_type(url);
    case "dailymotion":
    case "vimeo":
      return "video"; // These platforms only have videos for now
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
