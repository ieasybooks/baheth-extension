import { get_settings } from "../storage";

// Helper function to get extension URL that works with TypeScript
function getExtensionURL(path: string): string {
  // Access the global namespace using Window interface
  const win = window as any;
  
  // Chrome, Edge, Opera
  if (win.chrome?.runtime?.getURL) {
    return win.chrome.runtime.getURL(path);
  }
  // Firefox
  else if (win.browser?.runtime?.getURL) {
    return win.browser.runtime.getURL(path);
  }
  // Fallback
  return path;
}

export async function show_toast(baheth_link, type: "video" | "playlist", timeout = 0, isLoading = false) {
  // Get settings for timeout if not explicitly provided
  if (timeout === 0) {
    const settings = await get_settings();
    timeout = settings.notification_timeout || 6000; // Default to 6 seconds if not set
  }
  
  // Detect dark mode
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Remove existing toasts before showing a new one
  if (!isLoading) {
    delete_all_toasts();
  }
  
  // create toast element
  const toast = document.createElement("div");
  toast.classList.add("baheth-toast");
  if (prefersDarkMode) {
    toast.classList.add("dark-mode");
  }
  
  if (isLoading) {
    toast.classList.add("loading-toast");
    toast.innerHTML = `
      <div class="toast-header">
        <img class="baheth-logo" src="${getExtensionURL(prefersDarkMode ? "baheth-logo-light.svg" : "baheth-logo-dark.svg")}" alt="Baheth" />
        <div class="loading-indicator"></div>
      </div>
      <div class="toast-content">
        <p class="toast-title">جاري التحقق...</p>
        <p class="toast-description">${
          type === "video" ? "جاري التحقق من وجود المقطع على باحث" : "جاري التحقق من وجود قائمة التشغيل على باحث"
        }</p>
      </div>
      <button class="close" aria-label="إغلاق">×</button>
    `;
  } else {
    toast.innerHTML = `
      <div class="toast-header">
        <img class="baheth-logo" src="${getExtensionURL(prefersDarkMode ? "baheth-logo-light.svg" : "baheth-logo-dark.svg")}" alt="Baheth" />
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
  }

  document.body.appendChild(toast);

  // show the toast after 100ms of creation with animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Auto-hide after configured timeout only if not a loading toast
  let autoHideTimeout;
  if (!isLoading && timeout > 0) {
    autoHideTimeout = setTimeout(() => {
      delete_all_toasts();
    }, timeout);
  }

  // handle toast click
  toast.onclick = (event) => {
    const target = event.target as Element;
    
    if (target.classList.contains("close")) {
      if (autoHideTimeout) clearTimeout(autoHideTimeout);
      delete_all_toasts();
    } else if (!isLoading && (target.classList.contains("toast-action") || !target.classList.contains("close"))) {
      // open baheth link
      window.open(baheth_link, "_blank");
    }
  };
  
  // Return the toast element to allow for potential reference and removal
  return toast;
}

export async function show_error_toast(message: string, errorCode?: string) {
  // Get settings for timeout
  const settings = await get_settings();
  const timeout = 6000; // Fixed 6 seconds for error messages
  
  // Detect dark mode
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Remove existing toasts before showing error
  delete_all_toasts();
  
  // create toast element
  const toast = document.createElement("div");
  toast.classList.add("baheth-toast", "error-toast");
  if (prefersDarkMode) {
    toast.classList.add("dark-mode");
  }
  
  toast.innerHTML = `
    <div class="toast-header">
      <div class="error-indicator">⚠️</div>
      ${errorCode ? `<span class="error-code">${errorCode}</span>` : ''}
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
  
  return toast;
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
