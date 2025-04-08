export function get_clean_youtube_url() {
  // match video/playlist id
  const match = location.href.match(/(?:\/watch\?v=|\/playlist\?list=)([^&]+)/);

  // get page type
  const page_type = location.href.includes("/watch?v=")
    ? "video"
    : location.href.includes("/playlist?list=")
    ? "playlist"
    : "unknown";

  if (!match || page_type === "unknown") return;

  // video/playlist id
  const id = match[1];

  // id search param name
  const id_param = page_type === "video" ? "v" : "list";

  // return the clean url
  return `${location.origin}${location.pathname}?${id_param}=${id}`;
}
