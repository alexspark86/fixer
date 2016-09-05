import Element, {POSITION, STATE} from "./element";
import {getScrolledPosition} from "./utils";
import debounce from "debounce";
import throttle from "throttleit";

let documentHeight = document.documentElement.offsetHeight;

/**
 * Class representing a fixer.
 * @class
 */
class Fixer {

  /**
   * Create fixer.
   */
  constructor () {
    // array of the registered elements to fix
    this.elements = [];

    // listen to the page load and scroll
    let onScroll = throttle(() => this.onScroll(getScrolledPosition()), 16);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("load", onScroll);

    // listen to the page resize and recalculate elements width
    let onResize = debounce(() => this.recalculateElementsWidth(getScrolledPosition()), 100);
    window.addEventListener("resize", onResize);
  }

  /**
   * Adding an element to Fixer.
   * @param {String|HTMLElement|jQuery} selector
   * @param {defaults=} options
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

    // re-fix elements in stack if needed
    this.onScroll(getScrolledPosition(), true);

    return this;
  }

  /**
   * Function listening scroll.
   * @param {Scrolled} scrolled Document scrolled values in pixels
   * @param {Boolean=} forceFix Option to fix elements even if they're fixed
   */
  onScroll (scrolled, forceFix) {
    this.checkDocumentHeight();

    let i = this.elements.length;
    while (i--) this.fixToggle(this.elements[i], scrolled, forceFix);
  }

  /**
   * Function to fix/unFix an element.
   * @param {Element} element Element instance
   * @param {Scrolled} scrolled Document scrolled values in pixels
   * @param {Boolean=} [forceFix = element.state === STATE.default] Option to fix an element even if it fixed
   */
  fixToggle (element, scrolled, forceFix = element.state === STATE.default) {
    let offset = element.offset;
    let limit = element.getLimit();
    let stack = this.getStackHeight(element);
    let limitDiff = limit !== null ? limit - (scrolled.top + element.node.offsetHeight + stack) : null;

    let needToFix = element.options.position === POSITION.top ? offset.top <= scrolled.top + stack : offset.bottom >= scrolled.top - stack + document.documentElement.offsetHeight;
    let needToLimit = limit !== null ? limitDiff <= 0 : false;

    // Fix/unFix or limit an element to its container or set it to absolute (to limit)
    if (needToLimit && element.state !== STATE.limited) {
      element.setAbsolute();
    }
    else if (needToFix && ((forceFix && !needToLimit) || (!needToLimit && element.state === STATE.limited))) {
      element.fix(stack);
    }
    else if (!needToFix) {
      element.unFix();
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

      if (element.options.position === item.options.position) {
        let itemOnTheWay = element.options.position === POSITION.top ? item.offset.top < element.offset.top : item.offset.top > element.offset.bottom;

        if (itemOnTheWay) {
          let willHideByLimit = item.limit !== null && (element.options.position === POSITION.top ? item.limit <= element.offset.top : item.limit >= element.offset.bottom);

          if (!willHideByLimit)
            sum += item.node.offsetHeight || 0;
        }
      }
    }

    return sum;
  }

  /**
   * Update offsets of elements if the document's height has changed.
   */
  checkDocumentHeight () {
    if (document.documentElement.offsetHeight !== documentHeight) {
      documentHeight = document.documentElement.offsetHeight;

      let i = this.elements.length;
      while (i--) this.elements[i].updateOffset();
    }
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
        item.state !== STATE.default && // if element is fixed
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