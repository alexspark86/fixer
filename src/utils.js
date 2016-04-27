/**
 * Defining an element
 * @param {string|jQuery|HTMLElement} element
 */
export function defineElement (element) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  else if (element instanceof $ && element.length) {
    element = element[0];
  }

  return element;
}

/**
 * Calculating browser styles for an element
 * @param {HTMLElement} element
 */
export function calculateStyles (element) {
  var styles = window.getComputedStyle(element, null);

  return {
    position: styles.position,
    top: styles.top,
    zIndex: styles.zIndex,
    display: styles.display,
    marginTop: styles.marginTop,
    marginBottom: styles.marginBottom,
    width: styles.width,
    maxWidth: styles.maxWidth
  };
}

/**
 * Calculating browser styles for an element
 * @param {HTMLElement} element
 * @param {object} styles
 */
export function calculateOffset (element, styles) {
  var rect = this.element.getBoundingClientRect();

  return {
    top: rect.top + document.documentElement.scrollTop - parseInt(styles.marginTop),
    left: rect.left + document.documentElement.scrollLeft
  };
}