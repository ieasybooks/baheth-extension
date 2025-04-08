import { get_baheth_media_info } from "./lib/api";
import { init_location_observer } from "./lib/observer";
import { init_styles } from "./lib/styles";
import { delete_all_toasts, show_toast } from "./lib/toast";
import { get_clean_youtube_url } from "./lib/url";

async function detect_baheth_media(location: Location) {
  // delete all toasts if any
  delete_all_toasts();

  // generating a clean youtube url (reference id)
  const clean_url = get_clean_youtube_url(location.href);
  if (!clean_url) return;

  // get data for the given url
  const baheth_data = await get_baheth_media_info(clean_url);
  if (!baheth_data?.link) return;

  // if it exists on baheth, show a toast
  show_toast(baheth_data.link);
}

// inject baheth extension css styles
init_styles();

// initialize location observer
init_location_observer(detect_baheth_media);
