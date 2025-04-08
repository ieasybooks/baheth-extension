export function show_toast(baheth_link) {
  // create toast element
  const toast = document.createElement("div");
  toast.classList.add("baheth-toast");
  toast.innerHTML = `
    <p class="toast-title">هذا المقطع متوفر على باحث! 🔍</p>
    <p class="toast-description">اضغط لمشاهدته عبر باحث.</p>
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
    if (event.target.classList.contains("close")) {
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
    toast.remove();
  });
}
