// import { browser } from "webextension-polyfill-ts";
import { default_settings } from "./constants";

export function show_toast(baheth_link: string, type: string) {
  if (document.getElementById("baheth-toast-container")) {
    return;
  }

  ensure_font_imported();

  // Create the toast itself
  const toast = document.createElement("div");
  toast.className = "baheth-toast";
  toast.classList.add("show");
  
  if (is_mobile_device()) {
    toast.classList.add("mobile");
  }
  
  toast.classList.add("with-icon");

  // Create the toast title
  const toast_title = document.createElement("div");
  toast_title.className = "toast-title";
  
  let title_text = "";
  if (type === "video") {
    title_text = "تم العثور على فيديو";
  } else if (type === "playlist") {
    title_text = "تم العثور على قائمة تشغيل";
  }
  toast_title.textContent = title_text;

  // Create the message
  const message = document.createElement("p");
  message.className = "toast-description";
  message.textContent = "تم اكتشاف المحتوى وإعداده للتصفح في منصة باحث";

  // Create a wrapper div for content
  const content = document.createElement("div");
  content.appendChild(toast_title);
  content.appendChild(message);

  // Create the action button
  const action_button = document.createElement("button");
  action_button.textContent = "مشاهدة في باحث";
  action_button.className = "action-button";
  action_button.setAttribute("aria-label", "فتح الرابط في باحث");
  
  action_button.addEventListener("click", (e) => {
    e.stopPropagation();
    window.open(baheth_link, "_blank");
    delete_toast(toast);
  });
  
  content.appendChild(action_button);

  // Create the close button
  const close_button = document.createElement("button");
  close_button.textContent = "×";
  close_button.className = "close";
  close_button.setAttribute("aria-label", "إغلاق");
  
  close_button.addEventListener("click", (e) => {
    e.stopPropagation();
    delete_toast(toast);
  });

  // Add all elements to the toast
  toast.appendChild(content);
  toast.appendChild(close_button);

  // Add the toast to the body
  document.body.appendChild(toast);

  // Update found videos count in settings
  chrome.storage.local.get("settings", (result) => {
    const settings = result.settings || JSON.parse(JSON.stringify(default_settings));
    settings.found_videos_count = (settings.found_videos_count || 0) + 1;
    chrome.storage.local.set({ settings });
  });

  // Auto-close the toast after a delay
  chrome.storage.local.get("settings", (result) => {
    const settings = result.settings || JSON.parse(JSON.stringify(default_settings));
    const notification_display_time = settings.notification_display_time || 10;
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        delete_toast(toast);
      }
    }, notification_display_time * 1000);
  });
}

export function show_error_toast(message: string, description?: string) {
  if (document.querySelector(".baheth-toast.error")) {
    return;
  }

  ensure_font_imported();

  // Create the toast
  const toast = document.createElement("div");
  toast.className = "baheth-toast error";
  toast.classList.add("show");
  
  if (is_mobile_device()) {
    toast.classList.add("mobile");
  }
  
  toast.classList.add("with-icon");

  // Create the title
  const toast_title = document.createElement("div");
  toast_title.className = "toast-title";
  toast_title.textContent = "خطأ";

  // Create the message
  const message_element = document.createElement("p");
  message_element.className = "toast-description";
  message_element.textContent = message;

  // Create a wrapper div for content
  const content = document.createElement("div");
  content.appendChild(toast_title);
  content.appendChild(message_element);

  // Add description if provided
  if (description) {
    const description_element = document.createElement("p");
    description_element.className = "toast-description";
    description_element.textContent = description;
    content.appendChild(description_element);
  }

  // Create close button
  const close_button = document.createElement("button");
  close_button.textContent = "إغلاق";
  close_button.className = "action-button";
  
  close_button.addEventListener("click", () => {
    delete_toast(toast);
  });
  
  content.appendChild(close_button);

  // Add elements to toast
  toast.appendChild(content);

  // Add the toast to the body
  document.body.appendChild(toast);

  // Auto-close the toast after 10 seconds
  setTimeout(() => {
    if (document.body.contains(toast)) {
      delete_toast(toast);
    }
  }, 10000);
}

export function delete_toast(toast: HTMLElement) {
  toast.classList.remove("show");
  
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 300);
}

export function delete_all_toasts() {
  const toasts = document.querySelectorAll(".baheth-toast");
  toasts.forEach(toast => {
    if (toast instanceof HTMLElement) {
      delete_toast(toast);
    }
  });
}

function ensure_font_imported() {
  if (!document.getElementById("baheth-font-import")) {
    const link = document.createElement("link");
    link.id = "baheth-font-import";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;600&display=swap";
    document.head.appendChild(link);
  }
  
  // Ensure we load the styles.css file if it's not already loaded
  if (!document.getElementById("baheth-styles")) {
    const css_link = document.createElement("link");
    css_link.id = "baheth-styles";
    css_link.rel = "stylesheet";
    css_link.href = chrome.runtime.getURL("styles.css");
    document.head.appendChild(css_link);
  }
}

function is_mobile_device() {
  return window.innerWidth <= 768;
}

function is_rtl() {
  return true; // Always return true for Arabic-only interface
}
