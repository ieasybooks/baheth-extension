export function get_clean_youtube_url() {
  // match video/playlist id
  const match = location.href.match(/(?:\/watch\?v=|\/playlist\?list=)([^&]+)/);

  // get page type
  const page_type = getYoutubePageType(location.href);

  if (!match || page_type === "unknown") return;

  // video/playlist id
  const id = match[1];

  // id search param name
  const id_param = page_type === "video" ? "v" : "list";

  // return the clean url
  return `${location.origin}${location.pathname}?${id_param}=${id}`;
}

function getYoutubePageType(url: string): "video" | "playlist" | "unknown" {
  if (url.includes("/watch?v=")) {
    return "video";
  } else if (url.includes("/playlist?list=")) {
    return "playlist";
  } else {
    return "unknown";
  }
}
