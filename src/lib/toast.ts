// import { browser } from "webextension-polyfill-ts";
import { default_settings } from "./constants";

export function show_toast(baheth_link: string, type: string) {
  if (document.getElementById("baheth-toast-container")) {
    return;
  }

  ensure_font_imported();

  // Create the toast container
  const toast = document.createElement("div");
  toast.className = "baheth-toast";
  
  if (is_mobile_device()) {
    toast.classList.add("mobile");
  }

  // Create the header
  const header = document.createElement("div");
  header.className = "baheth-toast-header";
  
  // Create the icon
  const icon = document.createElement("div");
  icon.className = "baheth-toast-icon";
  
  // Create the title wrapper
  const titleWrapper = document.createElement("div");
  titleWrapper.className = "baheth-toast-title-wrapper";
  
  // Create the title
  const title = document.createElement("div");
  title.className = "toast-title";
  
  let title_text = "";
  if (type === "video") {
    title_text = "تم العثور على فيديو";
  } else if (type === "playlist") {
    title_text = "تم العثور على قائمة تشغيل";
  }
  title.textContent = title_text;
  
  titleWrapper.appendChild(title);
  
  // Add elements to header
  header.appendChild(icon);
  header.appendChild(titleWrapper);
  
  // Create content section
  const content = document.createElement("div");
  content.className = "baheth-toast-content";
  
  // Create the message
  const message = document.createElement("p");
  message.className = "toast-description";
  message.textContent = "تم اكتشاف المحتوى وإعداده للتصفح في منصة باحث";
  
  content.appendChild(message);
  
  // Create actions container
  const actions = document.createElement("div");
  actions.className = "baheth-toast-actions";
  
  // Create the watch action button
  const watchButton = document.createElement("button");
  watchButton.textContent = "مشاهدة في باحث";
  watchButton.className = "action-button";
  watchButton.setAttribute("aria-label", "فتح الرابط في باحث");
  
  watchButton.addEventListener("click", (e) => {
    e.stopPropagation();
    window.open(baheth_link, "_blank");
    delete_toast(toast);
  });
  
  // Create the dismiss button
  const dismissButton = document.createElement("button");
  dismissButton.textContent = "تجاهل";
  dismissButton.className = "action-button secondary";
  
  dismissButton.addEventListener("click", (e) => {
    e.stopPropagation();
    delete_toast(toast);
  });
  
  // Add buttons to actions
  actions.appendChild(watchButton);
  actions.appendChild(dismissButton);

  // Create the close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.className = "close";
  closeButton.setAttribute("aria-label", "إغلاق");
  
  closeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    delete_toast(toast);
  });

  // Add all elements to the toast
  toast.appendChild(header);
  toast.appendChild(content);
  toast.appendChild(actions);
  toast.appendChild(closeButton);

  // Add the toast to the body
  document.body.appendChild(toast);
  
  // Add show class after a small delay to trigger animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Update found videos count in settings
  chrome.storage.local.get("settings", (result) => {
    const settings = result.settings || JSON.parse(JSON.stringify(default_settings));
    settings.found_videos_count = (settings.found_videos_count || 0) + 1;
    chrome.storage.local.set({ settings });
  });

  // Auto-close the toast using the user's notification display time
  chrome.storage.local.get("settings", (result) => {
    const settings = result.settings || JSON.parse(JSON.stringify(default_settings));
    let notification_display_time = settings.notification_display_time || 10;
    
    // Ensure notification time is within allowed range (3-60 seconds)
    notification_display_time = Math.max(3, Math.min(60, notification_display_time));
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        delete_toast(toast);
      }
    }, notification_display_time * 1000);
  });
}

export function show_error_toast(message: string, description?: string) {
  // Limit to one error toast at a time
  const existingToast = document.querySelector(".baheth-toast.error");
  if (existingToast) {
    delete_toast(existingToast as HTMLElement);
  }

  ensure_font_imported();

  // Create the toast container
  const toast = document.createElement("div");
  toast.className = "baheth-toast error";
  
  if (is_mobile_device()) {
    toast.classList.add("mobile");
  }
  
  // Create the header
  const header = document.createElement("div");
  header.className = "baheth-toast-header";
  
  // Create the icon
  const icon = document.createElement("div");
  icon.className = "baheth-toast-icon";
  icon.textContent = "⚠️";
  
  // Create the title wrapper
  const titleWrapper = document.createElement("div");
  titleWrapper.className = "baheth-toast-title-wrapper";
  
  // Create the title
  const title = document.createElement("div");
  title.className = "toast-title";
  title.textContent = message;
  
  titleWrapper.appendChild(title);
  
  // Add elements to header
  header.appendChild(icon);
  header.appendChild(titleWrapper);
  
  // Create content section
  const content = document.createElement("div");
  content.className = "baheth-toast-content";

  // Create the message
  const messageElement = document.createElement("p");
  messageElement.className = "toast-description";
  
  // If description is empty, use a default message
  if (!description) {
    description = "يرجى التحقق من اتصالك بالإنترنت وحاول مرة أخرى.";
  }
  
  messageElement.textContent = description;
  
  content.appendChild(messageElement);
  
  // Create actions container
  const actions = document.createElement("div");
  actions.className = "baheth-toast-actions";
  
  // Add try again button for connection errors
  if (message.includes("اتصال") || description.includes("اتصال")) {
    const retryButton = document.createElement("button");
    retryButton.textContent = "حاول مرة أخرى";
    retryButton.className = "action-button retry";
    
    retryButton.addEventListener("click", () => {
      delete_toast(toast);
      // Trigger a page refresh to retry the connection
      window.location.reload();
    });
    
    actions.appendChild(retryButton);
  }

  // Create the dismiss button
  const dismissButton = document.createElement("button");
  dismissButton.textContent = "إغلاق";
  dismissButton.className = "action-button secondary";
  
  dismissButton.addEventListener("click", () => {
    delete_toast(toast);
  });
  
  actions.appendChild(dismissButton);

  // Create the close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.className = "close";
  closeButton.setAttribute("aria-label", "إغلاق");
  
  closeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    delete_toast(toast);
  });

  // Add all elements to the toast
  toast.appendChild(header);
  toast.appendChild(content);
  toast.appendChild(actions);
  toast.appendChild(closeButton);

  // Add the toast to the body
  document.body.appendChild(toast);

  // Add show class after a small delay to trigger animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Auto-close the toast using the user's notification display time
  chrome.storage.local.get("settings", (result) => {
    const settings = result.settings || JSON.parse(JSON.stringify(default_settings));
    let notification_display_time = settings.notification_display_time || 10;
    
    // Ensure notification time is within allowed range (3-60 seconds)
    notification_display_time = Math.max(3, Math.min(60, notification_display_time));
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        delete_toast(toast);
      }
    }, notification_display_time * 1000);
  });
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
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap";
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
  return window.innerWidth <= 768 || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function is_rtl() {
  return true; // Always return true for Arabic-only interface
}
