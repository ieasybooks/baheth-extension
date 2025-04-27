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
      const errorMessage = error.message || "";
      
      // Only show errors for networks issues, not for content not available
      if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
        show_error_toast("خطأ في الاتصال", "انتهت مهلة طلب البيانات من باحث. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.");
      } else if (errorMessage.includes('Network connection error') || errorMessage.includes('Failed to fetch')) {
        show_error_toast("خطأ في الاتصال", "تعذر الاتصال بخدمة باحث. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.");
      }
      
      console.error("Error fetching data from Baheth:", error);
      return;
    }

    // Don't show any toast if the content isn't available on Baheth
    if (!baheth_data?.link) {
      return; // Content not available, don't show any notification
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
    
    // Only show user-facing errors for critical issues
    const errorMessage = error?.message || "";
    if (errorMessage.includes('timeout') || errorMessage.includes('connection')) {
      show_error_toast("خطأ في الاتصال", "تعذر الاتصال بخدمة باحث. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.");
    }
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
