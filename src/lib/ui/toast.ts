import { get_settings } from "../storage";

export async function show_toast(baheth_link, type: "video" | "playlist") {
  // Get settings for timeout
  const settings = await get_settings();
  const timeout = settings.notification_timeout || 6000; // Default to 6 seconds if not set
  
  // Detect dark mode
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // create toast element
  const toast = document.createElement("div");
  toast.classList.add("baheth-toast");
  if (prefersDarkMode) {
    toast.classList.add("dark-mode");
  }
  
  toast.innerHTML = `
    <div class="toast-header">
      <img class="baheth-logo" src="${chrome.runtime.getURL(prefersDarkMode ? "baheth-logo-light.svg" : "baheth-logo-dark.svg")}" alt="Baheth" />
      <div class="notification-indicator"></div>
    </div>
    <div class="toast-content">
      <p class="toast-title">${
        type === "video" ? "هذا المقطع متاح" : "قائمة التشغيل هذه متاحة"
      } على باحث! 🔍</p>
      <p class="toast-description">اضغط للمشاهدة عبر باحث.</p>
    </div>
    <button class="toast-action">الانتقال إلى باحث</button>
    <button class="close" aria-label="إغلاق">×</button>
  `;

  document.body.appendChild(toast);

  // show the toast after 100ms of creation with animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Auto-hide after configured timeout
  const autoHideTimeout = setTimeout(() => {
    delete_all_toasts();
  }, timeout);

  // handle toast click
  toast.onclick = (event) => {
    const target = event.target as Element;
    
    if (target.classList.contains("close")) {
      clearTimeout(autoHideTimeout);
      delete_all_toasts();
    } else if (target.classList.contains("toast-action") || !target.classList.contains("close")) {
      // open baheth link
      window.open(baheth_link, "_blank");
    }
  };
}

export async function show_error_toast(message: string) {
  // Get settings for timeout
  const settings = await get_settings();
  const timeout = 6000; // Fixed 6 seconds for error messages
  
  // Detect dark mode
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // create toast element
  const toast = document.createElement("div");
  toast.classList.add("baheth-toast", "error-toast");
  if (prefersDarkMode) {
    toast.classList.add("dark-mode");
  }
  
  toast.innerHTML = `
    <div class="toast-header">
      <div class="error-indicator">⚠️</div>
    </div>
    <div class="toast-content">
      <p class="toast-title">خطأ</p>
      <p class="toast-description">${message}</p>
    </div>
    <button class="close" aria-label="إغلاق">×</button>
  `;

  document.body.appendChild(toast);

  // show the toast after 100ms of creation with animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Auto-hide after 6 seconds for error messages
  const autoHideTimeout = setTimeout(() => {
    delete_all_toasts();
  }, timeout);

  // handle toast click
  toast.onclick = (event) => {
    const target = event.target as Element;
    
    if (target.classList.contains("close")) {
      clearTimeout(autoHideTimeout);
      delete_all_toasts();
    }
  };
}

export function delete_all_toasts() {
  const toasts = document.querySelectorAll(".baheth-toast");

  toasts.forEach((toast) => {
    // Add a class to trigger the fade-out animation
    toast.classList.remove("show");

    // Remove the element after the animation completes
    toast.addEventListener("transitionend", () => toast.remove());

    // Fallback removal if transitionend doesn't fire
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300); // Adjust timeout based on transition duration
  });
}
