import { get_baheth_media_info, get_baheth_playlist_info } from "./lib/api";
import { init_location_observer } from "./lib/observer";
import { get_settings, set_setting } from "./lib/storage";
import { delete_all_toasts, show_toast, show_error_toast } from "./lib/toast";
import { get_clean_video_url, get_page_type, get_platform_type } from "./lib/url";

async function detect_baheth_media() {
  try {
    // delete all toasts if any
    delete_all_toasts();

    // Check if current platform is supported
    const platform = get_platform_type();
    if (platform === "unknown") {
      return; // Silently exit for unsupported platforms
    }

    // generating a clean url (reference id)
    const clean_url = get_clean_video_url();
    if (!clean_url) {
      // URL couldn't be parsed - no need to show error as it might just be an unsupported page structure
      return;
    }

    // get page type (playlist, video, unknown)
    const page_type = get_page_type(clean_url);
    if (page_type === "unknown") {
      return; // Not a video or playlist page, no need to show error
    }

    // get data for the given url
    let baheth_data;
    try {
      baheth_data = page_type === "video"
        ? await get_baheth_media_info(clean_url)
        : await get_baheth_playlist_info(clean_url);
    } catch (error) {
      show_error_toast("خطأ في الاتصال", "حدث خطأ أثناء الاتصال بخدمة باحث. يرجى المحاولة مرة أخرى.");
      console.error("Error fetching data from Baheth:", error);
      return;
    }

    if (!baheth_data?.link) {
      // Media not found in Baheth - show a message about it
      show_error_toast("المحتوى غير متوفر", "هذا المحتوى غير متوفر على منصة باحث.");
      return;
    }

    // get extension settings
    const settings = await get_settings();

    // if it exists on baheth, show a toast
    // or if auto-redirect is enabled, redirect to baheth.
    if (settings.auto_redirect) {
      window.location.href = baheth_data.link;
    } else {
      show_toast(baheth_data.link, page_type);
    }
  } catch (error) {
    console.error("Error in detect_baheth_media:", error);
    show_error_toast("حدث خطأ", "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "check_video") {
    detect_baheth_media();
  }
  return true;
});

// initialize location observer
init_location_observer(detect_baheth_media);
