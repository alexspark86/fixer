import Element from './element';
import defaults from './defaults';

/**
 * Class representing a fixer.
 */
class Fixer {

  /**
   * Create a fixer.
   */
  constructor () {
    // array of the registered elements to fix
    this.elements = [];

    // stack object
    this.stack = {
      top: [],
      bottom: []
    };

    // listen to the page load and scroll
    window.onload = window.onscroll = () => this.listenScroll(window.pageYOffset || document.documentElement.scrollTop);

    // listen to the page resize and recalculate elements width
    window.onresize = () => this.recalculateElementsWidth(window.pageYOffset || document.documentElement.scrollTop);
  }

  /**
   * Adding element to Fixer.
   * @param {defaults} options
   * @return {Element|boolean}
   */
  addElement (options) {
    let element = null;

    if (options) {
      element = new Element(options);

      if (element.element && element.element.tagName) {
        this.elements.push(element);
      }
      else {
        throw new Error("Can't add element '" + options.element +"', please check the options", options);
      }
    }
    else {
      throw new Error("Please, provide options to add new Fixer element");
    }

    return element;
  }

  /**
   * Function listening scroll.
   * @param {number} scrolled Document scrolled height in pixels
   */
  listenScroll (scrolled) {
    console.log(scrolled);
  }

  /**
   * Recalculating width of the fixed elements (on resize).
   * @param {number} scrolled Document scrolled height in pixels
   */
  recalculateElementsWidth (scrolled) {
    let i = this.elements.length;
    let item;

    while (i--) {
      item = this.elements[i];

      if (
        item.fixed &&                 // if element is fixed
        item.placeholder &&           // if element have placeholder
        item.placeholder.offsetWidth  // if placeholder have width value
      ) {
        // set the value of an element width equal to the width its placeholder
        item.element.style.width = item.placeholder.offsetWidth + 'px';
      }
    }

    // call listenScroll method to check all elements position
    this.listenScroll(scrolled);
  };
}

export default Fixer;