import { wait_for_element } from "../dom";

type ElementProps = Partial<{
  [K in keyof HTMLButtonElement]: HTMLButtonElement[K] extends
    | string
    | number
    | boolean
    | CSSStyleDeclaration
    | DOMTokenList
    | null
    ? HTMLButtonElement[K]
    : never;
}>;

type DropdownItem = {
  label: string;
  value: string;
};

type NormalButtonProps = ElementProps & {
  button_type?: "normal";
};

type DropdownButtonProps = ElementProps & {
  button_type: "with-dropdown";
  dropdown_items: DropdownItem[];
  dropdown_callback: (value: any) => void;
};

type ButtonProps = NormalButtonProps | DropdownButtonProps;

function render_button_dropdown(
  button: HTMLButtonElement,
  props: DropdownButtonProps
) {
  const dropdown = document.createElement("div");
  dropdown.className = "baheth-button-dropdown";

  const update_dropdown_position = () => {
    const button_bounding_rect = button.getBoundingClientRect();
    dropdown.style.position = "absolute";
    dropdown.style.left = `${button_bounding_rect.left}px`;
    dropdown.style.top = `${button_bounding_rect.bottom}px`;
    dropdown.style.width = `${button_bounding_rect.width}px`;
  };
  function toggle_dropdown() {
    dropdown.classList.toggle("visible");
  }
  function close_dropdown() {
    dropdown.classList.remove("visible");
  }

  if (props.dropdown_items?.length) {
    props.dropdown_items.forEach((item) => {
      const item_button = document.createElement("button");
      item_button.className = "baheth-button-dropdown-item";
      item_button.dataset.value = item.value;
      item_button.textContent = item.label;

      item_button.onclick = () => {
        props.dropdown_callback(item.value);
        close_dropdown();
      };

      dropdown.appendChild(item_button);
    });
  }

  window.addEventListener("resize", update_dropdown_position);
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    update_dropdown_position();
    toggle_dropdown();
  });
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target as Node)) {
      event.stopPropagation();
      close_dropdown();
    }
  });

  document.body.appendChild(dropdown);
  return dropdown;
}

export function create_button(
  text: string,
  props: ButtonProps = { button_type: "normal" }
) {
  const button = document.createElement("button");

  Object.entries(props).forEach(([key, value]) => {
    const custom_prop = key in button;
    if (value !== undefined && !custom_prop) {
      (button as any)[key] = value;
    }
  });

  button.classList.add("baheth-button");

  if (props.button_type === "with-dropdown") {
    button.innerText = text;

    // button.dataset["button-id"] = id;

    render_button_dropdown(button, props);
  } else if (props.button_type === "normal") {
    button.innerText = text;
  }

  return button;
}

export async function render_button(
  button_element: HTMLButtonElement,
  location: "video-info"
) {
  if (!(button_element instanceof HTMLButtonElement)) return;

  let parent: Element | undefined | null;

  if (location == "video-info") {
    const like_dislike_button_selector =
      "segmented-like-dislike-button-view-model";
    await wait_for_element(like_dislike_button_selector);

    // since "video-info" is the location of like and dislike buttons,
    // we get the parent of the like button and append the button to it.
    parent = document.querySelector(
      like_dislike_button_selector
    )?.parentElement;
  }

  if (!parent) return;

  if (location === "video-info") {
    button_element.classList.add("baheth-yt-button_video-info");
  }

  setTimeout(() => {
    if (["video-info"].includes(location)) {
      parent.prepend(button_element);
    } else {
      parent.appendChild(button_element);
    }
  }, 500);
}
