import Element, {POSITION, STATE, DEFAULTS} from "./element";
import {getScrolledPosition, defineElement, getDocumentSize, getWindowSize} from "./utils";
import debounce from "debounce";
import throttle from "throttleit";

let documentSize;
let windowSize;

/**
 * Class representing a fixer.
 * @class
 */
class Fixer {

  /**
   * Create fixer.
   */
  constructor () {
    // Save initial document height value
    documentSize = getDocumentSize();
    windowSize = getWindowSize();

    // Create an array for registering elements to fix
    this.elements = [];

    // Listen to the page load and scroll
    let onScroll = throttle(() => this._onScroll(getScrolledPosition()), 16);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("load", onScroll);

    // Listen to the page resize and recalculate elements width
    let onResize = debounce(() => {
      let currentWindowSize = getWindowSize();

      if (windowSize.width !== currentWindowSize.width || windowSize.height !== currentWindowSize.height) {
        // Update screen size value
        windowSize = currentWindowSize;

        // Reset all elements if screen was resized
        this.resetElements();
      }
    }, 4);
    window.addEventListener("resize", onResize);

    // Provide 'addElement' method for Element class to make possible chaining this method
    Element.prototype.addElement = this.addElement.bind(this);
  }

  /**
   * Add an element to Fixer.
   * @public
   * @param {String|HTMLElement|jQuery} selector
   * @param {defaults=} options
   * @return {Fixer}
   */
  addElement (selector, options) {
    let element = null;

    if (selector) {
      element = new Element(selector, options);

      if (element.node && element.node.tagName) {
        // Add new element to array
        this.elements.push(element);

        // Sort elements array by top-offset for correct calculation of limit on scrolling
        this.elements.sort(function (a, b) {
          return a.offset.top - b.offset.top;
        });
      }
      else {
        throw new Error("Can't add element '" + selector);
      }
    }
    else {
      throw new Error("Please, provide selector or node to add new Fixer element");
    }

    // Re-fix elements in stack if needed
    this._onScroll(getScrolledPosition(), true);

    return element;
  }

  /**
   * Remove an element from Fixer.
   * @public
   * @param {String|HTMLElement|jQuery} selector
   * @return {Fixer}
   */
  removeElement (selector) {
    let element = defineElement(selector);
    let i = this.elements.length;

    while (i--) {
      let item = this.elements[i];

      if (item && item.hasOwnProperty('node') && (this.elements[i]['node'] === element)) {
        let placeholder = this.elements[i].placeholder;

        this.elements[i].unFix();
        this.elements.splice(i, 1);

        document.body.removeChild(placeholder);
        placeholder = this.elements[i].placeholder = null;

        this.resetElements();

        break;
      }
    }
  }

  /**
   * Reset all elements position and calculated values.
   * @public
   */
  resetElements () {
    // UnFix all elements and update they values
    this._unfixAll();

    // Call onScroll method to reFix elements
    this._onScroll(getScrolledPosition(), true);
  }

  /**
   * Getting height of the fixed element.
   *
   * There are two options for using:
   * — You get current fixed height if the arguments did not assign.
   * — You get height of elements that will fixed on the provided offset. It useful for scrolling to anchor.
   *
   * @public
   * @param {String|Number|Function} [position = DEFAULTS.position] The side of the screen where elements should be fixed
   * @param {Number|Function=} [offset = scrolled.top] The offset value relative to the document for which to calculate the height of the fixed elements
   */
  getHeight (position = DEFAULTS.position, offset) {
    let elements;
    let sum = 0;
    let scrolled = getScrolledPosition();

    // Check arguments and reassign them if necessary
    if (typeof position === "number" || typeof position === "function") {
      offset = position;
      position = DEFAULTS.position;
    }

    if (typeof offset === "undefined") {
      return this._getCurrentHeight(position);
    }
    // Get offset value if provided function
    else if (typeof offset === "function") {
      offset = offset();
    }
    // Use current scroll position as offset if it doesn't provided
    else if (typeof offset !== "number") {
      offset = scrolled.top;
    }

    // Offset can't be larger than documentHeight, so choose a smaller value between them
    offset = Math.min(offset, documentSize.height - windowSize.height);

    // Unfix all elements to properly recalculate offset values
    this._unfixAll();

    // Filter and sort elements by position and scroll direction
    elements = this.elements.filter(function (element) {
      return element.options.position === position && element.options.stack === true;
    })
    .sort(function (a, b) {
      return (position === POSITION.top) ? b.offset.top - a.offset.top : a.offset.top - b.offset.top;
    });

    // Iterate through the elements
    let i = elements.length;
    while (i--) {
      let element = elements[i];

      // Update value of the limit for the element to get accurate calculations
      element.updateLimit();

      // Get values for an element
      let limit = element.limit;
      let height = element.node.offsetHeight;
      let stack = this._getStackHeight(element, {top: offset, left: scrolled.left});

      let limitDiff = limit !== null ? limit - offset - stack : null;

      // Check conditions
      let isNeedToFix = element.options.position === POSITION.top
        ? (element.offset.top <= offset + stack)
        : (element.offset.bottom >= offset - stack + windowSize.height);

      let isLimited = limitDiff !== null ? limitDiff < height : false;
      let isHideByLimit = limitDiff !== null ? limitDiff <= 0 : false;


      if (isLimited && !isHideByLimit) {
        sum += limitDiff;
      }
      else if (isNeedToFix && !isHideByLimit) {
        sum += height;
      }
    }

    // Clear elements variable
    elements = null;

    // Call onScroll method to reFix elements
    this._onScroll(getScrolledPosition(), true);

    return sum;
  }

  /**
   * Function listening scroll.
   * @protected
   * @param {Scrolled} scrolled Document scrolled values in pixels
   * @param {Boolean=} forceFix Option to fix elements even if they're fixed
   */
  _onScroll (scrolled, forceFix) {
    // Check document height (needs to update element values if the document height has dynamically changed)
    this._checkDocumentSize();

    // Update document size
    documentSize = getDocumentSize();

    // Update offsets of limits before fix/unFix elements (to prevent fix limit of each element before it offset was calculated)
    let i = this.elements.length;
    while (i--) this.elements[i].updateLimit();

    // Iterate trough the elements to fix/unFix
    i = this.elements.length;
    while (i--) this._fixToggle(this.elements[i], scrolled, forceFix);
  }

  /**
   * Function to fix/unFix an element.
   * @protected
   * @param {Element} element Element instance
   * @param {Scrolled} scrolled Document scrolled values in pixels
   * @param {Boolean=} [forceFix = element.state === STATE.default] Option to fix an element even if it fixed
   */
  _fixToggle (element, scrolled, forceFix = element.state === STATE.default) {
    // Get values for an element
    let offset = element.offset;
    let limit = element.limit;
    let stack = this._getStackHeight(element, scrolled);

    // Check conditions
    let isNeedToFix = element.options.position === POSITION.top
      ? (offset.top <= scrolled.top + stack)
      : (offset.bottom >= scrolled.top - stack + windowSize.height);
    let isNeedToLimit = limit !== null ? limit <= scrolled.top + element.node.offsetHeight + stack : false;

    // Check current state
    let isLimited = element.state === STATE.limited;
    let isNotFixed = forceFix || isLimited;

    // Fix/unFix or limit an element to its container or Set it to absolute (to limit)
    if (isNeedToLimit && !isLimited) {
      element.setLimited();
    }
    else if (isNeedToFix && isNotFixed && !isNeedToLimit) {
      element.fix(stack);
    }
    else if (!isNeedToFix && element.state !== STATE.default) {
      element.unFix();
    }

    // Update horizontal position on horizontal scrolling
    if (element.state === STATE.fixed) {
      element.adjustHorizontal(scrolled.left);
    }

    // Stretch element if is needed (experimental feature)
    if (element.options.stretchTo !== null) {
      element.stretch(scrolled);
    }
  }

  /**
   * Get stack height for an element.
   * @protected
   * @param {Element} element
   * @param {Scrolled} scrolled Document scrolled values in pixels
   */
  _getStackHeight (element, scrolled) {
    let sum = 0;
    let i = this.elements.length;

    // Iterate through registered elements to determine whether they should be added to the element's stack
    while (i--) {
      let item = this.elements[i];

      // Consider only items with the same position
      if (element.options.position === item.options.position && item.options.stack === true) {

        // Check if the item is on the way of element, when scrolling (up or down) - this will affect fixing the element
        let isItemOnTheWay = element.options.position === POSITION.top
          ? item.offset.top < element.offset.top
          : item.offset.top > element.offset.bottom;

        if (isItemOnTheWay) {
          // Check if an item will be hidden when reaching its 'limit' coordinate
          let willHideByLimit = item.limit !== null && (element.options.position === POSITION.top
              ? item.limit <= element.offset.top + scrolled.top
              : item.limit >= element.offset.bottom);

          // If an item is on the way and it will not be limited, then add it's height to sum
          if (!willHideByLimit)
            sum += item.node.offsetHeight || 0;
        }
      }
    }

    return sum;
  }

  /**
   * Getting current height of a fixed elements by the provided position.
   * @public
   * @param {String=} [position = DEFAULTS.position]
   * @return {Number}
   */
  _getCurrentHeight (position = DEFAULTS.position) {
    let fixedHeight = 0;
    let limitedHeight = 0;
    let i = this.elements.length;

    // Iterate trough registered elements
    while (i--) {
      let element = this.elements[i];

      // Check only elements attached to the provided side of the screen
      if (position === element.options.position && element.options.stack === true) {

        // Make sure the item state is fixed and then add it height to calculation
        if (element.state === STATE.fixed) {
          fixedHeight += element.node.offsetHeight || 0;
        }
        // If item is limited then calculate it coordinate relative to the window.
        // Depending on the item position we need to use top or bottom coordinate.
        // Since a limited element may have a negative coordinate, we need to take positive value or 0 by Math.max method.
        else if (element.state === STATE.limited) {
          let offset = element.node.getBoundingClientRect();
          let height = (position === POSITION.top) ? offset.bottom : offset.top;

          limitedHeight = Math.max(limitedHeight, height);
        }
      }
    }

    // Return a larger value between sum of heights of fixed and limited elements.
    return Math.max(fixedHeight, limitedHeight);
  }

  /**
   * Update offsets of elements if the document's height has changed.
   * @protected
   */
  _checkDocumentSize () {
    let currentDocumentSize = getDocumentSize();

    if (currentDocumentSize.width !== documentSize.width || currentDocumentSize.height !== documentSize.height) {
      // Save current height of the document
      documentSize = currentDocumentSize;

      // Update values for each element
      let i = this.elements.length;
      while (i--) this.elements[i].updateValues();
    }
  }

  /**
   * UnFix all elements and update they values.
   * @protected
   */
  _unfixAll () {
    // UnFix all elements
    let i = this.elements.length;
    while (i--) {
      this.elements[i].unFix();
    }

    // Update values of the elements
    i = this.elements.length;
    while (i--) {
      this.elements[i].updateValues();
    }
  }
}

export default Fixer;