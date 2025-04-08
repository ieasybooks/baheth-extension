export function init_location_observer(location_change_handler: () => void) {
  let observer = new MutationObserver(() => {
    const current_location = window.location.href;

    // if the location changed, run detection process again.
    if (window.BAHETH_LAST_LOCATION !== current_location) {
      location_change_handler();
      window.BAHETH_LAST_LOCATION = current_location;
    }
  });

  // observe changes in the document body to detect location change
  observer.observe(document.body, { childList: true, subtree: true });
}
