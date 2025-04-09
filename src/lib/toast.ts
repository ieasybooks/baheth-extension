export function show_toast(baheth_link, type: "video" | "playlist") {
  // Ensure the font import is added before creating the toast
  ensure_font_imported();

  // create toast element
  const toast = document.createElement("div");
  toast.classList.add("baheth-toast");
  toast.innerHTML = `
    <p class="toast-title">${
      type === "video" ? "هذا المقطع متاح" : "قائمة التشغيل هذه متاحة"
    } على باحث! 🔍</p>
    <p class="toast-description">اضغط للمشاهدة عبر باحث.</p>
    <button class="close">تجاهل</button>
  `;

  document.body.appendChild(toast);

  // show the toast after 300ms of creation
  setTimeout(() => {
    toast.classList.add("show");
  }, 300);

  // handle toast click
  toast.onclick = (event) => {
    // @ts-ignore
    if ((event.target as Element).classList.contains("close")) {
      delete_all_toasts();
    } else {
      // open baheth link
      window.open(baheth_link, "_blank");
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

    // Fallback removal if transitionend doesn't fire (e.g., element removed before transition)
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 500); // Adjust timeout based on transition duration (0.25s in your CSS)
  });
}

function ensure_font_imported() {
  const font_import_id = "baheth-font-import";

  // Check if the style tag already exists
  if (document.getElementById(font_import_id)) {
    return;
  }

  // Create a style element
  const style = document.createElement("style");
  style.id = font_import_id;

  // Add the Google Fonts @import rule
  style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap');`;

  // Append the style element to the head of the document
  (document.head || document.documentElement).appendChild(style);
}
