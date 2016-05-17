/**
 * Defining an element
 * @param {String|jQuery|HTMLElement} element
 * @return {HTMLElement}
 */
export function defineElement (element) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  else if (typeof $ != 'undefined' && element instanceof $ && element.length) {
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
    float: styles.float,
    clear: styles.clear,
    display: styles.display,
    marginTop: styles.marginTop,
    marginRight: styles.marginRight,
    marginBottom: styles.marginBottom,
    marginLeft: styles.marginLeft,
    width: styles.width,
    maxWidth: styles.maxWidth
  };
}

/**
 * Calculating offsets of the element from each side of the document
 * @param {HTMLElement} element
 * @param {Object} styles
 * 
 * @typedef {Object} Offset
 * @property {Number} top
 * @property {Number} bottom
 * @property {Number} left
 * @property {Number} right
 * 
 * @return {Offset}
 */
export function calculateOffset (element, styles) {
  var rect = element.getBoundingClientRect();

  return {
    top: rect.top + document.documentElement.scrollTop - parseInt(styles.marginTop),
    bottom: rect.bottom + document.documentElement.scrollTop - parseInt(styles.marginTop),
    left: rect.left + document.documentElement.scrollLeft,
    right: rect.right + document.documentElement.scrollLeft
  };
}

/**
 * Getting scrollbar position
 * 
 * @typedef {Object} Scrolled
 * @property {Number} top
 * @property {Number} left
 * 
 * @return {Scrolled}
 */
export function getScrolledPosition () {
  return {
    top: window.pageYOffset || document.documentElement.scrollTop,
    left: window.pageXOffset || document.documentElement.scrollLeft
  }
}