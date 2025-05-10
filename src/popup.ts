import { get_settings, set_setting } from "./lib/storage";
import { ensure_fonts_imported } from "./lib/fonts";

// elements
const settings_inputs = document.querySelectorAll(
  "[data-type=setting-input]"
) as NodeListOf<HTMLInputElement>;
const themeToggleButton = document.getElementById('theme-toggle');
const loadingOverlay = document.getElementById('loading-overlay');
const foundVideosCount = document.getElementById('found-videos-count');
const resetVideosCountButton = document.getElementById('reset-videos-count');
const notificationTimeoutSlider = document.getElementById('notification-timeout-slider') as HTMLInputElement;
const notificationTimeoutValue = document.getElementById('notification-timeout-value');

// Theme handling
function setTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('dark-theme');
    document.documentElement.classList.remove('light-theme');
    localStorage.setItem('baheth-theme', 'dark');
  } else {
    document.documentElement.classList.add('light-theme');
    document.documentElement.classList.remove('dark-theme');
    localStorage.setItem('baheth-theme', 'light');
  }
}

function getPreferredTheme(): boolean {
  const savedTheme = localStorage.getItem('baheth-theme');
  if (savedTheme === 'dark') return true;
  if (savedTheme === 'light') return false;
  
  // Check system preference
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Loading state
function showLoading() {
  if (loadingOverlay) {
    loadingOverlay.classList.add('active');
  }
}

function hideLoading() {
  if (loadingOverlay) {
    loadingOverlay.classList.remove('active');
  }
}

// Reset videos count
async function resetVideosCount() {
  showLoading();
  await set_setting('found_videos_count', 0);
  if (foundVideosCount) {
    foundVideosCount.textContent = '0';
  }
  if (resetVideosCountButton) {
    resetVideosCountButton.setAttribute('disabled', 'true');
  }
  hideLoading();
}

// Update videos count display
function updateVideosCountDisplay(count: number) {
  if (foundVideosCount) {
    foundVideosCount.textContent = count.toString();
  }
  
  // Enable or disable reset button based on count
  if (resetVideosCountButton) {
    if (count > 0) {
      resetVideosCountButton.removeAttribute('disabled');
    } else {
      resetVideosCountButton.setAttribute('disabled', 'true');
    }
  }
}

// Update notification timeout display
function updateNotificationTimeoutDisplay(timeoutMs: number) {
  const timeoutSeconds = Math.round(timeoutMs / 1000);
  if (notificationTimeoutValue) {
    notificationTimeoutValue.textContent = timeoutSeconds.toString();
  }
  if (notificationTimeoutSlider) {
    notificationTimeoutSlider.value = timeoutSeconds.toString();
  }
}

// handlers
async function handle_setting_change(event) {
  const property = event.target.dataset.property;
  const multiplier = event.target.dataset.multiplier ? parseInt(event.target.dataset.multiplier) : 1;
  let value =
    event.target.type === "checkbox"
      ? event.target.checked
      : event.target.value;
  
  // Apply multiplier if needed (for slider values)
  if (event.target.type === "range" && multiplier > 1) {
    // Store the value as milliseconds but display as seconds
    value = parseInt(value) * multiplier;
    
    // Update the display immediately for better UX
    if (property === "notification_timeout") {
      updateNotificationTimeoutDisplay(value);
    }
  }

  showLoading();
  await set_setting(property, value);
  hideLoading();
}

// Add micro-interaction classes
function addFadeInClass() {
  const elements = document.querySelectorAll('.options-list, .welcome-message, .footer, .stats-panel');
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('fade-in');
    }, index * 100);
  });
}

// Ensure auto_check is always enabled
async function ensureAutoCheckEnabled() {
  const settings = await get_settings();
  if (settings.auto_check === false || settings.auto_check === undefined) {
    await set_setting('auto_check', true);
  }
}

// initialization
(async () => {
  // load fonts
  ensure_fonts_imported();

  // Initialize theme
  const isDarkTheme = getPreferredTheme();
  setTheme(isDarkTheme);

  // get saved settings
  showLoading();
  const settings = await get_settings();
  
  // Make sure auto_check is always enabled since we removed the UI toggle
  await ensureAutoCheckEnabled();
  
  // Update videos count display
  updateVideosCountDisplay(settings.found_videos_count || 0);
  
  // Update notification timeout display
  updateNotificationTimeoutDisplay(settings.notification_timeout || 6000);
  
  hideLoading();

  // Add animation classes
  addFadeInClass();

  settings_inputs.forEach((element) => {
    // set initial values
    const property = element.dataset.property;
    if (!property) return;

    const value = settings[property];
    const multiplier = element.dataset.multiplier ? parseInt(element.dataset.multiplier) : 1;

    if (element.type === "checkbox") {
      element.checked = value;
    } else if (element.type === "range" && multiplier > 1) {
      // Convert milliseconds to seconds for display
      element.value = Math.round(value / multiplier).toString();
    } else {
      element.value = value;
    }

    // event listener
    element.addEventListener("change", handle_setting_change);
    
    // For range inputs, also listen for input to update display in real-time
    if (element.type === "range") {
      element.addEventListener("input", (e) => {
        if (property === "notification_timeout" && notificationTimeoutValue) {
          notificationTimeoutValue.textContent = element.value;
        }
      });
    }
  });

  // Theme toggle event listener
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark-theme');
      setTheme(!isDark);
    });
  }
  
  // Reset videos count event listener
  if (resetVideosCountButton) {
    resetVideosCountButton.addEventListener('click', resetVideosCount);
  }
})();
