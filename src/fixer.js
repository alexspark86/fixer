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
    window.onload = window.onscroll = function() {
      this.listenScroll(window.pageYOffset || document.documentElement.scrollTop);
    }.bind(this);
  }

  /**
   * Function listening scroll.
   * @param {number} scrolled
   */
  listenScroll (scrolled) {
    console.log(scrolled);
  }

  /**
   * Adding element to Fixer.
   * @param {defaults} options
   * @return {Element|boolean}
   */
  addElement (options) {
    var element = null;

    if (options) {
      element = new Element(options);
      
      if (element.element.tagName) {
        this.elements.push(element);
      }
      else {
        throw new Error("Can't add element, please check options", options);
      }
    }
    else {
      throw new Error("Please, provide options to add new Fixer element");
    }

    return element;
  }
}

export default Fixer;