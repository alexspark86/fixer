import Element, {POSITION, STATE, DEFAULTS} from "./element";
import {getScrolledPosition, defineElement, getDocumentHeight, getClientHeight} from "./utils";
import debounce from "debounce";
import throttle from "throttleit";

let documentHeight;

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
    documentHeight = getDocumentHeight();

    // Create an array for registering elements to fix
    this.elements = [];

    // Listen to the page load and scroll
    let onScroll = throttle(() => this.onScroll(getScrolledPosition()), 16);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("load", onScroll);

    // Listen to the page resize and recalculate elements width
    let onResize = debounce(() => this.resetElements(), 4);
    window.addEventListener("resize", onResize);
  }

  /**
   * Add an element to Fixer.
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
    this.onScroll(getScrolledPosition(), true);

    return this;
  }

  /**
   * Remove an element from Fixer.
   * @param {String|HTMLElement|jQuery} selector
   * @return {Fixer}
   */
  removeElement (selector) {
    let element = defineElement(selector);
    let i = this.elements.length;

    while (i--) {
      let item = this.elements[i];

      if (item && item.hasOwnProperty('node') && (this.elements[i]['node'] === element)) {
        this.elements[i].unFix();
        this.elements.splice(i, 1);

        this.resetElements();

        break;
      }
    }
  }

  /**
   * Function listening scroll.
   * @param {Scrolled} scrolled Document scrolled values in pixels
   * @param {Boolean=} forceFix Option to fix elements even if they're fixed
   */
  onScroll (scrolled, forceFix) {
    // Check document height (needs to update element values if the document height has dynamically changed)
    this.checkDocumentHeight();

    // Update offsets of limits before fix/unFix elements (to prevent fix limit of each element before it offset was calculated)
    let i = this.elements.length;
    while (i--) this.elements[i].updateLimit();

    // Iterate trough the elements to fix/unFix
    i = this.elements.length;
    while (i--) this.fixToggle(this.elements[i], scrolled, forceFix);
  }

  /**
   * Function to fix/unFix an element.
   * @param {Element} element Element instance
   * @param {Scrolled} scrolled Document scrolled values in pixels
   * @param {Boolean=} [forceFix = element.state === STATE.default] Option to fix an element even if it fixed
   */
  fixToggle (element, scrolled, forceFix = element.state === STATE.default) {
    // Get values for an element
    let offset = element.offset;
    let limit = element.limit;
    let stack = this.getStackHeight(element, scrolled);
    let windowHeight = getClientHeight();

    // Check conditions
    let isNeedToFix = element.options.position === POSITION.top
      ? (offset.top <= scrolled.top + stack)
      : (offset.bottom >= scrolled.top - stack + windowHeight);
    let isNeedToLimit = limit !== null ? limit <= scrolled.top + element.node.offsetHeight + stack : false;

    // Check current state
    let isLimited = element.state === STATE.limited;
    let isNotFixed = forceFix || isLimited;

    // Fix/unFix or limit an element to its container or Set it to absolute (to limit)
    if (isNeedToLimit && !isLimited) {
      element.setAbsolute();
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
  }

  /**
   * Get stack height for an element.
   * @param {Element} element
   * @param {Scrolled} scrolled Document scrolled values in pixels
   */
  getStackHeight (element, scrolled) {
    let sum = 0;
    let i = this.elements.length;

    // Iterate through registered elements to determine whether they should be added to the element's stack
    while (i--) {
      let item = this.elements[i];

      // Consider only items with the same position
      if (element.options.position === item.options.position) {

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
   * @param {String=} [position = DEFAULTS.position]
   * @return {Number}
   */
  getHeight (position = DEFAULTS.position) {
    let fixedHeight = 0;
    let limitedHeight = 0;
    let i = this.elements.length;

    // Iterate trough registered elements
    while (i--) {
      let item = this.elements[i];

      // Check only elements attached to the provided side of the screen
      if (position === item.options.position) {

        // Make sure the item state is fixed and then add it height to calculation
        if (item.state === STATE.fixed) {
          fixedHeight += item.node.offsetHeight || 0;
        }
        // If item is limited then calculate it coordinate relative to the window.
        // Depending on the item position we need to use top or bottom coordinate.
        // Since a limited element may have a negative coordinate, we need to take positive value or 0 by Math.max method.
        else if (item.state === STATE.limited) {
          let offset = item.node.getBoundingClientRect();
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
   */
  checkDocumentHeight () {
    let currentDocumentHeight = getDocumentHeight();

    if (currentDocumentHeight !== documentHeight) {
      // Save current height of the document
      documentHeight = currentDocumentHeight;

      // Update values for each element
      let i = this.elements.length;
      while (i--) this.elements[i].updateValues();
    }
  }

  /**
   * Reset all elements position and calculated values.
   */
  resetElements () {
    // UnFix all elements and update they values
    this.unfixAll();

    // Call onScroll method to reFix elements
    this.onScroll(getScrolledPosition(), true);
  }

  /**
   * UnFix all elements and update they values.
   */
  unfixAll () {
    let i = this.elements.length;

    // UnFix all elements and update they values
    while (i--) {
      let element = this.elements[i];

      element.unFix();
      element.updateValues();
    }
  }
}

export default Fixer;