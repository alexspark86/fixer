import {defineElement, calculateStyles, calculateOffset, setStyle, addClass, removeClass} from "./utils";
import objectAssign from "object-assign";

/**
 * @typedef {Object} elementDefaults
 * @property {String} position Screen side to fix an element ("top"|"bottom")
 * @property {Boolean} placeholder Indicates whether placeholder is needed
 * @property {String} placeholderClass Classname to generate the placeholder
 * @property {String} fixedClass Classname to add for a fixed element
 * @property {HTMLElement|String|Function} limit Selector or node of the limiter for an element
 */
const DEFAULTS = {
  position: "top",
  placeholder: true,
  placeholderClass: "fixer-placeholder",
  fixedClass: "_fixed",
  limit: null
};

/**
 * Class representing an element.
 * 
 * @class
 * @property {elementDefaults} options Custom options for an element, extends DEFAULTS with initial options
 * @property {String} position Position to fix
 * @property {HTMLElement} node Node element
 * @property {HTMLElement} placeholder Placeholder node
 * @property {HTMLElement} limiter Limiter node
 * @property {Boolean} fixed Current fixed state
 * @property {Number} height Element's height
 * @property {Offset} offset Calculated offsets of the element from each side of the document
 * @property {Number} stackOffset
 * @property {Object} styles Saved initial styles
 */
export default class Element {

  /**
   * Create an element.
   * @param {string|HTMLElement} selector
   * @param {elementDefaults} options
   */
  constructor (selector, options) {
    // extend element's options with initial- and default-options
    objectAssign(this.options = {}, DEFAULTS, options);

    // init basic parameters
    objectAssign(this, {
      node: defineElement(selector),
      limit: defineElement(this.options.limit),
      position: this.options.position,
      fixed: false
    });

    if (this.node && this.node.tagName) {
      // saving styles of element
      this.styles = calculateStyles(this.node);

      // saving top and left offsets of element
      this.offset = calculateOffset(this.node, this.styles);

      // saving element height
      this.height = this.node.offsetHeight;

      // creating placeholder if needed
      this.placeholder = this.options.placeholder ? this.createPlaceholder() : null;
    }
  }

  /**
   * Create placeholder node.
   * @return {HTMLElement}
   */
  createPlaceholder () {
    let placeholder = document.createElement("span");

    placeholder.className = this.options.placeholderClass;

    setStyle(placeholder, {
      zIndex: "-1", // for buggy Safari
      float: this.styles.float,
      clear: this.styles.clear,
      display: "none",
      marginTop: this.styles.marginTop,
      marginRight: this.styles.marginRight,
      marginBottom: this.styles.marginBottom,
      marginLeft: this.styles.marginLeft,
      width: this.node.offsetWidth + "px",
      height: this.node.offsetHeight + "px",
      maxWidth: this.styles.maxWidth
    });

    this.node.parentNode.insertBefore(placeholder, this.node.nextSibling);

    return placeholder;
  }

  /**
   * Fix an element's node.
   * @param {number} offset
   */
  fix (offset) {
    let {node: element, placeholder} = this;

    // set styles for an element node
    let cssProperties = {
      position: "fixed",
      [this.position]: offset + "px",
      zIndex: this.styles.zIndex === "auto" ? "100" : this.styles.zIndex,
      width: this.styles.width
    };

    if (this.styles.float !== "none") {
      cssProperties.left = this.offset.left - parseInt(this.styles.marginLeft) + "px";
    }

    setStyle(element, cssProperties);

    // set styles for placeholder node
    if (placeholder) {
      setStyle(placeholder, {
        display: this.styles.display
      });
    }

    // add fixed className for an element node
    addClass(element, this.options.fixedClass);

    // update fixed state for the instance of an element
    this.fixed = true;
  }

  /**
   * Unfix an element's node (return its state to initial) and update properties.
   */
  unFix () {
    let {node: element, placeholder} = this;

    setStyle(element, {
      position: this.styles.position,
      [this.position]: this.styles[this.position],
      zIndex: this.styles.zIndex,
      marginTop: this.styles.marginTop,
      width: ""
    });

    if (placeholder) {
      setStyle(placeholder, {
        display: "none"
      });
    }

    removeClass(element, this.options.fixedClass);

    this.fixed = false;
  };

  /**
   * Hide node of an element.
   */
  hide () {
    setStyle(this.node, {display: "none"});
  }

  /**
   * Show node of an element (return its initial display style).
   */
  show () {
    setStyle(this.node, {display: this.styles.display});
  }
}