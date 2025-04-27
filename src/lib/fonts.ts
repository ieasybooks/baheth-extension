const fonts = {
  "NotoNaskhArabicUI[wght].ttf": {
    font_name: "NotoNaskhArabicUI",
    font_weight: "100 700",
  },
};

export function ensure_fonts_imported() {
  for (const [file_name, { font_name, font_weight }] of Object.entries(fonts)) {
    const font_url = chrome.runtime.getURL("/fonts/" + file_name);

    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: "${font_name}";
        src: url("${font_url}");
        font-weight: ${font_weight};
      }
    `;
    document.head.appendChild(style);
  }
}
