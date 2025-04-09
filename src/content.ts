import { get_baheth_media_info } from "./lib/api";
import { init_location_observer } from "./lib/observer";
import { get_settings } from "./lib/storage";
import { delete_all_toasts, show_toast } from "./lib/toast";
import { get_clean_youtube_url } from "./lib/url";

async function detect_baheth_media() {
  // delete all toasts if any
  delete_all_toasts();

  // generating a clean youtube url (reference id)
  const clean_url = get_clean_youtube_url();
  if (!clean_url) return;

  // get data for the given url
  const baheth_data = await get_baheth_media_info(clean_url);
  if (!baheth_data?.link) return;

  // get extension settings
  const settings = await get_settings();

  // if it exists on baheth, show a toast
  // or if auto-redirect is enabled, redirect to baheth.
  if (settings.auto_redirect) {
    window.location.href = baheth_data.link;
  } else {
    show_toast(baheth_data.link);
  }
}

// initialize location observer
init_location_observer(detect_baheth_media);
