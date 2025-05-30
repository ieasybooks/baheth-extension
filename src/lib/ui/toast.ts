export function show_toast(baheth_link, type: "video" | "playlist") {
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
