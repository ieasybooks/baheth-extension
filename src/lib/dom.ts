export async function wait_for_element(selector): Promise<Element> {
  return new Promise((resolve) => {
    let element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    let observer = new MutationObserver((record) => {
      for (const { addedNodes } of record) {
        for (const node of addedNodes) {
          if (node.nodeType === 1) {
            let element = node as Element;
            if (element.matches(selector)) {
              resolve(element);
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });
  });
}
