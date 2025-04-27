import { get_settings, set_setting } from "./lib/storage";

// elements
const settings_inputs = document.querySelectorAll(
  "[data-type=setting-input]"
) as NodeListOf<HTMLInputElement>;
const foundVideosCountElement = document.getElementById("found-videos-count");
const resetButton = document.querySelector(".reset-button") as HTMLButtonElement;

// handlers
async function handle_setting_change(event) {
  const property = event.target.dataset.property;
  let value =
    event.target.type === "checkbox"
      ? event.target.checked
      : event.target.value;
      
  // Ensure notification display time is within allowed range (3-60 seconds)
  if (property === "notification_display_time") {
    value = Math.max(3, Math.min(60, parseInt(value, 10)));
    event.target.value = value; // Update input field to reflect constrained value
  }

  set_setting(property, value);
}

// Reset found videos count
function reset_found_videos_count() {
  set_setting("found_videos_count", 0);
  if (foundVideosCountElement) {
    foundVideosCountElement.textContent = "0";
  }
  
  // Disable the reset button when count is 0
  if (resetButton) {
    resetButton.disabled = true;
    
    // Add visual feedback
    resetButton.classList.add("button-feedback");
    setTimeout(() => {
      resetButton.classList.remove("button-feedback");
    }, 300);
  }
}

// initialization
(async () => {
  // get saved settings
  const settings = await get_settings();

  // Update found videos count display
  if (foundVideosCountElement) {
    foundVideosCountElement.textContent = settings.found_videos_count.toString();
  }
  
  // Configure reset button
  if (resetButton) {
    resetButton.onclick = reset_found_videos_count;
    // Disable reset button if count is 0
    resetButton.disabled = settings.found_videos_count === 0;
  }

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
    
    // Add visual feedback for number inputs
    if (element.type === "number") {
      element.addEventListener("change", () => {
        element.classList.add("input-feedback");
        setTimeout(() => {
          element.classList.remove("input-feedback");
        }, 300);
      });
    }
  });
})();
