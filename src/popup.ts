import { get_settings, set_setting } from "./lib/storage";
import { ensure_fonts_imported } from "./lib/fonts";

// elements
const settings_inputs = document.querySelectorAll(
  "[data-type=setting-input]"
) as NodeListOf<HTMLInputElement>;

// handlers
async function handle_setting_change(event) {
  const property = event.target.dataset.property;
  const value =
    event.target.type === "checkbox"
      ? event.target.checked
      : event.target.value;

  set_setting(property, value);
}

// initialization
(async () => {
  // load fonts
  ensure_fonts_imported();

  // get saved settings
  const settings = await get_settings();

  settings_inputs.forEach((element) => {
    // set initial values
    const property = element.dataset.property;
    if (!property) return;

    const value = settings[property];

    if (element.type === "checkbox") {
      element.checked = value;
    } else {
      element.value = value;
    }

    // event listener
    element.addEventListener("change", handle_setting_change);
  });
})();
