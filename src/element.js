import {defineElement, calculateStyles, calculateOffset, setStyle, addClass, removeClass} from "./utils";
import objectAssign from "object-assign";

/**
 * Position string values.
 * @readonly
 * @enum {string}
 */
export const POSITION = {
  top: "top",
  bottom: "bottom"
};

/**
 * State string values.
 * @readonly
 * @enum {string}
 */
export const STATE = {
  default: "default",
  fixed: "fixed",
  limited: "limited"
};

/**
 * Default element options.
 * @readonly
 *
 * @typedef {Object} defaults
 * @property {String} position Screen side to fix an element ("top"|"bottom")
 * @property {Boolean} placeholder Indicates whether placeholder is needed
 * @property {String} placeholderClass Classname to generate the placeholder
 * @property {String} fixedClass Classname to add for a fixed element
 * @property {HTMLElement|String|Function} limit Selector, node or function of the limit for an element
 */
export const DEFAULTS = {
  position: POSITION.top,
  placeholder: true,
  placeholderClass: "fixer-placeholder",
  fixedClass: "_fixed",
  limit: null
};

/**
 * Class representing an element.
 * @class
 *
 * @property {defaults} options Custom options for an element, extends DEFAULTS with initial options
 * @property {STATE} state Current element state
 *
 * @property {HTMLElement} node Node of an element
 * @property {Offset} offset Calculated offsets of an element node from each side of the document
 * @property {Object} styles Saved initial styles of an element node
 *
 * @property {HTMLElement} placeholder Link for placeholder node
 *
 * @property {Number} limit Actual limit offset value (top/bottom depending on the position)
 * @property {HTMLElement} parent Offset parent of an element; needs for properly positioning limited element to the parent
 *
 */
export default class Element {

  /**
   * Create an element.
   * @param {string|HTMLElement} selector
   * @param {defaults} options
   */
  constructor (selector, options) {
    if (options) {
      options.limit = defineElement(options.limit);
    }

    // Extend element's options with initial- and default-options
    objectAssign(this.options = {}, DEFAULTS, options);

    // Init basic parameters
    objectAssign(this, {
      state: STATE.default,
      node: defineElement(selector),
      limit: null,
      parent: null
    });

    if (this.node && this.node.tagName) {
      // Saving original styles of an element node
      this.styles = calculateStyles(this.node);

      // Saving original offsets of an element node
      this.offset = calculateOffset(this.node, this.styles);

      // Creating placeholder if needed
      this.placeholder = this.options.placeholder ? this.createPlaceholder() : null;

      // Set offset parent of the node
      this.parent = this.node.offsetParent;

      // Calculate limit offset
      this.updateLimit();
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

    // Set styles for an element node
    let cssProperties = {
      position: "fixed",
      [this.options.position]: offset + "px",
      zIndex: this.styles.zIndex === "auto" ? "100" : this.styles.zIndex,
      marginTop: 0,
      marginBottom: 0,
      width: this.styles.width
    };

    // Set left coordinate if element is floated to the left/right
    if (this.styles.float !== "none") {
      cssProperties.left = this.offset.left - parseInt(this.styles.marginLeft) + "px";
    }

    // Set styles for a node
    setStyle(element, cssProperties);

    // Set styles for placeholder node
    if (placeholder) {
      setStyle(placeholder, {
        display: this.styles.display,
        width: this.node.offsetWidth + "px"
      });
    }

    // Add fixed className for an element node
    addClass(element, this.options.fixedClass);

    // Set fixed state for the instance of an element
    this.state = STATE.fixed;
  }

  /**
   * Unfix an element's node (return its state to initial) and update properties.
   */
  unFix () {
    let {node: element, placeholder} = this;

    setStyle(element, {
      position: this.styles.position,
      [this.options.position]: this.styles[this.options.position],
      zIndex: this.styles.zIndex,
      marginTop: this.styles.marginTop,
      marginBottom: this.styles.marginBottom,
      width: ""
    });

    if (placeholder) {
      setStyle(placeholder, {
        display: "none"
      });
    }

    removeClass(element, this.options.fixedClass);

    this.state = STATE.default;
  };

  /**
   * Set position absolute with correct coordinates relative to parent to properly fix an element by its limiter.
   */
  setAbsolute () {
    let {node: element, offset, limit, parent, placeholder, styles} = this;

    let parentOffset = calculateOffset(parent);
    let offsetTop = limit - parentOffset.top - element.offsetHeight;
    let offsetLeft = offset.left - parentOffset.left - parseInt(this.styles.marginLeft);

    // Set styles for an element node
    setStyle(element, {
      position: "absolute",
      top: offsetTop + "px",
      left: offsetLeft + "px",
      bottom: "auto",
      right: "auto",
      zIndex: this.styles.zIndex === "auto" ? "100" : this.styles.zIndex,
      marginTop: 0,
      marginBottom: 0,
      width: this.styles.width
    });

    // Set styles for placeholder node
    if (placeholder) {
      setStyle(placeholder, {
        display: styles.display
      });
    }

    // Add fixed className for an element node
    addClass(element, this.options.fixedClass);

    this.state = STATE.limited;
  };

  /**
   * Update actual value of limit for en element.
   */
  updateLimit () {
    let limit = this.options.limit;
    let value;

    // Call function if it represented
    if (typeof limit === "function") {
      limit = limit();
    }

    // Set limit value
    if (typeof limit === "number") {
      value = limit;
    }
    // If limit is {HTMLElement} then set it offset for the value
    else if (limit !== null && typeof limit === "object" && limit.tagName !== "undefined") {
      value = calculateOffset(limit)[this.options.position];
    }

    value = typeof value === "number" ? value : null;

    this.limit = value;
  };

  /**
   * Update original values for element, such as styles and offset.
   */
  updateValues () {
    // Update styles of an element node
    this.styles = calculateStyles(this.node);

    // Update offset
    this.offset = calculateOffset(this.state === STATE.default ? this.node : this.placeholder, this.styles);
  }

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