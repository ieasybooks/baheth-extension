export function init_location_observer(location_change_handler: () => void) {
  let last_location = window.location.href

  let observer = new MutationObserver(() => {
    const current_location = window.location.href;

    if (last_location !== current_location) {
      location_change_handler();

      last_location = current_location;
    }
  });

  // observe changes in the document body to detect location change
  observer.observe(document, { childList: true, subtree: true });
}
