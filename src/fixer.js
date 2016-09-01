import Element from "./element";
import {defineElement, getScrolledPosition} from "./utils";
import debounce from "debounce";
import throttle from "throttleit";

/**
 * @typedef {Object} defaults
 * @property {HTMLElement|String} Selector or node of root container for a fixer instance
 */
var DEFAULTS = {
  container: document.documentElement
};

/**
 * Class representing a fixer.
 * @class
 */
class Fixer {

  /**
   * Create fixer.
   * @param {HTMLElement|String=} container
   */
  constructor (container) {
    // define root container for a fixer instance
    this.container = defineElement(container || DEFAULTS.container);

    // array of the registered elements to fix
    this.elements = [];

    this.initListeners();
  }

  /**
   * Init listeners for a container and window.
   */
  initListeners () {
    var container = this.container;

    if (container === DEFAULTS.container) {
      container = window;
    }

    // onScroll and onResize functions
    let onScroll = throttle(() => this.onScroll(getScrolledPosition(this.container)), 16);
    let onResize = debounce(() => this.recalculateElementsWidth(getScrolledPosition(this.container)), 100);

    // listen for container scroll
    container.addEventListener("scroll", onScroll);

    // listen for window load and resize
    window.addEventListener("load", onScroll);
    window.addEventListener("resize", onResize);
  }

  /**
   * Adding an element to Fixer.
   * @param {String|HTMLElement|jQuery} selector
   * @param {elementDefaults=} options
   * @return {Fixer}
   */
  addElement (selector, options) {
    let element = null;

    if (selector) {
      element = new Element(selector, options);

      if (element.node && element.node.tagName) {
        // add new element to array
        this.elements.push(element);

        // sort elements array by top-offset for correct calculation of limit on scrolling
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

    // update stacks
    this.updateStacks();

    return this;
  }

  /**
   * Function listening scroll.
   * @param {Scrolled} scrolled Document scrolled values in pixels
   */
  onScroll (scrolled) {
    let i = this.elements.length;

    while (i--) this.fixToggle(this.elements[i], scrolled);
  }

  /**
   * Function to fix/unFix an element.
   * @param {Element} element Element instance
   * @param {Scrolled} scrolled Document scrolled values in pixels
   * @param {Boolean=} forceFix Option to fix an element even if it fixed
   */
  fixToggle (element, scrolled, forceFix = !element.fixed) {
    let stackHeight = element.stackOffset;

    if (element.position === "top") {
      if (forceFix && element.offset.top <= scrolled.top + stackHeight) {
        element.fix(stackHeight);
      }
      else if (element.offset.top >= scrolled.top + stackHeight) {
        element.unFix();
      }
    }
    else if (element.position === "bottom") {
      if (forceFix && element.offset.bottom >= scrolled.top - stackHeight + this.container.offsetHeight) {
        element.fix(stackHeight);
      }
      else if (element.offset.bottom <= scrolled.top - stackHeight + this.container.offsetHeight) {
        element.unFix();
      }
    }

  }

  /**
   * Update stackOffset property of every element and re-fix some element if needed.
   */
  updateStacks () {
    let i = this.elements.length;

    while (i--) {
      let element = this.elements[i];

      // update stackOffset for an element
      element.stackOffset = this.getStackHeight(element);

      // re-fix element if needed
      this.fixToggle(element, getScrolledPosition(this.container), true);
    }
  }

  /**
   * Get stack height for an element.
   * @param {Element} element
   */
  getStackHeight (element) {
    let sum = 0;
    let i = this.elements.length;

    while (i--) {
      let item = this.elements[i];

      if (element.position === item.position && (element.position === "top" ? item.offset.top < element.offset.top : item.offset.bottom > element.offset.bottom)) {
        sum += item.height || 0;
      }
    }

    return sum;
  }

  /**
   * Recalculate width of the fixed elements (on resize).
   * @param {Scrolled} scrolled Document scrolled height in pixels
   */
  recalculateElementsWidth (scrolled) {
    let i = this.elements.length;

    while (i--) {
      let item = this.elements[i];

      if (
        item.fixed &&                   // if element is fixed
        item.placeholder &&             // if element have placeholder
        item.placeholder.offsetWidth && // if placeholder have width value
        item.node.offsetWidth !== item.placeholder.offsetWidth
      ) {
        // TODO: check calculating of width with different css box-sizing values
        // set the value of an element width equal to the width its placeholder
        item.node.style.width = item.placeholder.offsetWidth - item.styles.paddingLeft - item.styles.paddingRight + "px";
      }
    }

    // call onScroll method to check all elements position
    this.onScroll(scrolled);
  };
}

export default Fixer;