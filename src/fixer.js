import Element, {POSITION, STATE} from "./element";
import {getScrolledPosition} from "./utils";
import debounce from "debounce";
import throttle from "throttleit";

let documentHeight = document.documentElement.offsetHeight;
let lastScroll = getScrolledPosition().top;

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
    let onResize = debounce(() => this.resetElements(), 4);
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
    // check scroll direction
    let scrollDown = scrolled.top > lastScroll;
    lastScroll = scrolled.top;

    // check document height (needs to update element values if the document height has dynamically changed)
    this.checkDocumentHeight();

    // Choose iteration method depending on scroll direction.
    // Shuffling elements in the reverse scrolling direction to avoid fixing elements, which are the limits.
    //
    // REWRITE: the better solution is to calculate limits offsets BEFORE execute fixToggle function (in a separate function).
    if (scrollDown) {
      for (let i = 0, max = this.elements.length; i < max; i += 1)
        this.fixToggle(this.elements[i], scrolled, forceFix);

    } else {
      let i = this.elements.length;
      while (i--) this.fixToggle(this.elements[i], scrolled, forceFix);

    }
  }

  /**
   * Function to fix/unFix an element.
   * @param {Element} element Element instance
   * @param {Scrolled} scrolled Document scrolled values in pixels
   * @param {Boolean=} [forceFix = element.state === STATE.default] Option to fix an element even if it fixed
   */
  fixToggle (element, scrolled, forceFix = element.state === STATE.default) {
    // get values for an element
    //
    // DON'T change the order of declaration of variables,
    // because 'offset' is needed to calculate limit and 'limit' is needed to get stackHeight.
    let offset = element.offset;
    let limit = element.getLimit();
    let stack = this.getStackHeight(element, scrolled);

    // check conditions
    let needToFix = element.options.position === POSITION.top ? offset.top <= scrolled.top + stack : offset.bottom >= scrolled.top - stack + document.documentElement.offsetHeight;
    let needToLimit = limit !== null ? limit <= scrolled.top + element.node.offsetHeight + stack : false;
    let isLimited = element.state === STATE.limited;
    let isNotFixed = forceFix || isLimited;

    // Fix/unFix or limit an element to its container or Set it to absolute (to limit)
    if (needToLimit && !isLimited) {
      element.setAbsolute();
    }
    else if (needToFix && isNotFixed && !needToLimit) {
      element.fix(stack);
    }
    else if (!needToFix) {
      element.unFix();
    }
  }

  /**
   * Get stack height for an element.
   * @param {Element} element
   * * @param {Scrolled} scrolled Document scrolled values in pixels
   */
  getStackHeight (element, scrolled) {
    let sum = 0;
    let i = this.elements.length;

    while (i--) {
      let item = this.elements[i];

      if (element.options.position === item.options.position) {
        let itemOnTheWay = element.options.position === POSITION.top ? item.offset.top < element.offset.top : item.offset.top > element.offset.bottom;

        if (itemOnTheWay) {
          let willHideByLimit = item.limit !== null && (element.options.position === POSITION.top ? item.limit <= element.offset.top + scrolled.top : item.limit >= element.offset.bottom);

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
      // save current height of the document
      documentHeight = document.documentElement.offsetHeight;

      // update values for each element
      let i = this.elements.length;
      while (i--) this.elements[i].updateValues();
    }
  }

  /**
   * Reset all elements position and calculated values.
   */
  resetElements () {
    let i = this.elements.length;

    // unFix all elements and update they values
    while (i--) {
      let element = this.elements[i];

      element.unFix();
      element.updateValues();
    }

    // call onScroll method to reFix elements
    this.onScroll(getScrolledPosition());
  }
}

export default Fixer;