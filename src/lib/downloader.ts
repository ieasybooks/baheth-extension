export function download_file(url: string) {
  const trigger_element = document.createElement("a");
  trigger_element.href = url;
  trigger_element.download = url;
  trigger_element.click();
}
