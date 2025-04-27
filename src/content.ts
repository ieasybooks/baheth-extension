import { get_baheth_media_info, get_baheth_playlist_info } from "./lib/api";
import { init_location_observer } from "./lib/observer";
import { get_settings } from "./lib/storage";
import { create_button, render_button } from "./lib/ui/button";
import { delete_all_toasts, show_toast } from "./lib/ui/toast";
import { get_clean_youtube_url, get_youtube_page_type } from "./lib/url";
import { get_tafreegh_options, get_url_by_type } from "./lib/tafreegh";
import { download_file } from "./lib/downloader";
import { ensure_fonts_imported } from "./lib/fonts";

async function handle_location_change() {
  // generating a clean youtube url (reference id)
  const clean_url = get_clean_youtube_url();
  if (!clean_url) return;

  // get page type (playlist, video, unknown)
  const page_type = get_youtube_page_type(clean_url);
  if (page_type === "unknown") return;

  // get data for the given url
  const baheth_data =
    page_type === "video"
      ? await get_baheth_media_info(clean_url)
      : await get_baheth_playlist_info(clean_url);
  if (!baheth_data?.link) return;

  handle_baheth_content(baheth_data, page_type);
}

// cleanup function to remove extension-related DOM elements and other stuff
function cleanup() {
  // delete all toasts if any
  delete_all_toasts();
}

// runs if the video/playlist is already on baheth
async function handle_baheth_content(
  baheth_data,
  page_type: "video" | "playlist"
) {
  // get extension settings
  const settings = await get_settings();

  // if it exists on baheth, show a toast
  // or if auto-redirect is enabled, redirect to baheth.
  if (settings.auto_redirect) {
    window.location.href = baheth_data.link;
  } else {
    show_toast(baheth_data.link, page_type);
  }

  // render tafreegh download button if possible
  if (
    baheth_data?.transcription_txt_link ||
    baheth_data?.transcription_pdf_link
  ) {
    let button = create_button("تحميل التفريغ", {
      className: "tafreegh-download-button",
      button_type: "with-dropdown",
      dropdown_items: [
        ...get_tafreegh_options(baheth_data).map((option) => ({
          label: option.toUpperCase(),
          value: option,
        })),
      ],
      dropdown_callback: (type: string) => {
        let tafreegh_url = get_url_by_type(baheth_data, type);
        download_file(tafreegh_url);
      },
    });

    render_button(button, "video-info");
  }
}

// add event listener for "yt-page-data-updated"
// this is the best way to check if youtube has fetched video data
// note: there's a difference between "*-updated" and "*-fetched"
// - yt-page-data-update; when youtube's context provider stores the fetched data.
// - yt-page-data-fetched; when the request is done.
document.addEventListener("yt-page-data-updated", (ev) => {
  handle_location_change();
});

// load fonts
ensure_fonts_imported();

// initialize location observer to cleanup the page
init_location_observer(() => {
  cleanup();
});
