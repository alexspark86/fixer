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
const DEFAULTS = {
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
    options.limit = defineElement(options.limit);

    // extend element's options with initial- and default-options
    objectAssign(this.options = {}, DEFAULTS, options);

    // init basic parameters
    objectAssign(this, {
      state: STATE.default,
      node: defineElement(selector),
      limit: null,
      parent: null
    });

    if (this.node && this.node.tagName) {
      // saving original styles of an element node
      this.styles = calculateStyles(this.node);

      // saving original offsets of an element node
      this.offset = calculateOffset(this.node, this.styles);

      // creating placeholder if needed
      this.placeholder = this.options.placeholder ? this.createPlaceholder() : null;

      // calculate limit offset
      this.limit = this.getLimit();

      // set offset parent of the node
      this.parent = this.node.offsetParent;
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
      [this.options.position]: offset + "px",
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

    // set fixed state for the instance of an element
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

    // set styles for an element node
    setStyle(element, {
      position: "absolute",
      top: offsetTop + "px",
      left: offsetLeft + "px",
      bottom: "auto",
      right: "auto",
      zIndex: this.styles.zIndex === "auto" ? "100" : this.styles.zIndex,
      width: this.styles.width
    });

    // set styles for placeholder node
    if (placeholder) {
      setStyle(placeholder, {
        display: styles.display
      });
    }

    // add fixed className for an element node
    addClass(element, this.options.fixedClass);

    this.state = STATE.limited;
  };

  /**
   * Get actual value of limit for en element.
   * @return {?Number}
   */
  getLimit () {
    let limit = this.options.limit;
    let value;

    // call function if it represented
    if (typeof limit === "function") {
      limit = limit();
    }

    // set limit value
    if (typeof limit === "number") {
      value = limit;
    }
    // if limit is {HTMLElement} then set it offset for the value
    else if (limit !== null && typeof limit === "object" && limit.tagName !== "undefined") {
      value = calculateOffset(limit)[this.options.position];
    }

    value = typeof value === "number" ? Math.round(value) : null;

    this.limit = value;

    return value;
  };

  /**
   * Calculating offsets of an element from each side of the screen.
   * @return {Offset}
   */
  updateOffset () {
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