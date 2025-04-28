const fonts = {
  "NotoNaskhArabicUI[wght].ttf": {
    font_name: "NotoNaskhArabicUI",
    font_weight: "100 700",
  },
};

export function ensure_fonts_imported() {
  if (document.querySelector("[baheth-fonts-style]")) return;

  const style = document.createElement("style");
  style.setAttribute("baheth-fonts-style", "");

  style.textContent = Object.entries(fonts).reduce(
    (prev, [file_name, { font_name, font_weight }]) => {
      const font_url = chrome.runtime.getURL("/fonts/" + file_name);

      return `${prev}
        @font-face {
          font-family: "${font_name}";
          src: url("${font_url}");
          font-weight: ${font_weight};
        }
        \n`;
    },
    ""
  );

  document.head.appendChild(style);
}
