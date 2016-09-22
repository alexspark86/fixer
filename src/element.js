import {defineElement, calculateStyles, calculateOffset, setStyle, addClass, removeClass, objectHasValue, getClientHeight, createEvent} from "./utils";
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
 * Event string values.
 * @readonly
 * @enum {string}
 */
export const EVENT = {
  init: "init",
  update: "update",
  fixed: "fixed",
  preFixed: "preFixed",
  unfixed: "unfixed",
  preUnfixed: "preUnfixed",
  limited: "limited",
  preLimited: "preLimited"
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
 * @property {Boolean} stack Parameter indicates whether the height of the element count for fixing other elements
 * @property {HTMLElement|String|Function} limit Selector, node or function of the limit for an element
 * @property {HTMLElement|String|Function} stretchTo EXPERIMENTAL feature – Selector, node or function of the coordinate to stretch element vertically to it
 */
export const DEFAULTS = {
  position: POSITION.top,
  placeholder: true,
  placeholderClass: "fixer-placeholder",
  fixedClass: "_fixed",
  stack: true,
  limit: null,
  stretchTo: null
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
    // Extend element's options with initial- and default-options
    objectAssign(this.options = {}, DEFAULTS, options);

    if (options) {
      this.options.limit = defineElement(this.options.limit);
      this.options.stretchTo = defineElement(this.options.stretchTo);

      // do not count element height for fixing other elements if it has option 'stretchTo'
      this.options.stack = this.options.stretchTo === null;
    }

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
      this.placeholder = this.options.placeholder ? this._createPlaceholder() : null;

      // Set offset parent of the node
      this.parent = this.node.offsetParent;

      // Dispatch the event
      this.node.dispatchEvent(createEvent(EVENT.init));
    }
  }

  /**
   * Create placeholder node.
   * @protected
   * @return {HTMLElement}
   */
  _createPlaceholder () {
    let placeholder = document.createElement("span");

    placeholder.className = this.options.placeholderClass;

    setStyle(placeholder, {
      zIndex: "-1", // for buggy Safari
      float: this.styles.float,
      clear: this.styles.clear,
      display: "none",
      position: this.styles.position,
      top: this.styles.top,
      right: this.styles.right,
      bottom: this.styles.bottom,
      left: this.styles.left,
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

    // Dispatch the event
    this.node.dispatchEvent(createEvent(EVENT.preFixed));

    // Set styles for an element node
    let cssProperties = {
      position: "fixed",
      [this.options.position]: offset + "px",
      left: this.offset.left + "px",
      zIndex: this.styles.zIndex === "auto" ? "100" : this.styles.zIndex,
      marginTop: 0,
      marginBottom: 0,
      width: this.styles.width
    };

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

    // Dispatch the event
    this.node.dispatchEvent(createEvent(EVENT.fixed));
  }

  /**
   * Unfix an element's node (return its state to initial) and update properties.
   */
  unFix () {
    let {node: element, placeholder} = this;

    // Dispatch the event
    this.node.dispatchEvent(createEvent(EVENT.preUnfixed));

    setStyle(element, {
      position: "",
      [this.options.position]: "",
      left: "",
      zIndex: "",
      marginTop: "",
      marginBottom: "",
      width: ""
    });

    if (placeholder) {
      setStyle(placeholder, {
        display: "none"
      });
    }

    removeClass(element, this.options.fixedClass);

    // Update state
    this.state = STATE.default;

    // Dispatch the event
    this.node.dispatchEvent(createEvent(EVENT.unfixed));
  };

  /**
   * Set position absolute with correct coordinates relative to parent to properly fix an element by its limiter.
   */
  setLimited () {
    let {node: element, offset, limit, parent, placeholder, styles} = this;

    let parentOffset = calculateOffset(parent);
    let offsetTop = limit - parentOffset.top - element.offsetHeight;
    let offsetLeft = offset.left - parentOffset.left;

    // Dispatch the event
    this.node.dispatchEvent(createEvent(EVENT.preLimited));

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

    // Update state
    this.state = STATE.limited;

    // Dispatch the event
    this.node.dispatchEvent(createEvent(EVENT.limited));
  };

  /**
   * Stretch element vertically to the provided element or offset value.
   */
  stretch (scrolled) {
    let stretchTo = getStretchOffset(this.options.stretchTo, this.options.position) - scrolled.top;
    let top = this.node.getBoundingClientRect().top;
    let windowHeight = getClientHeight();

    stretchTo = windowHeight - stretchTo < 0 ? windowHeight : stretchTo;

    setStyle(this.node, {
      height: (stretchTo - top) + "px"
    });

    // Calculate stretch offset
    function getStretchOffset (limit, position) {
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
        value = calculateOffset(limit)[position];
      }

      return typeof value === "number" ? value : null;
    }
  }

  /**
   * Adjusting horizontal position of an element relative to scrollLeft if page is scrolled horizontally.
   * @param {Number} scrollLeft
   */
  adjustHorizontal (scrollLeft) {
    let leftDiff = Math.round(this.offset.left - scrollLeft);
    let rightDiff = scrollLeft + document.documentElement.offsetWidth - this.offset.right;
    let currentLeft = parseInt(this.node.style.left) || null;

    let left = null;

    // check if the left side of the element is out of the page
    if (leftDiff < 0) {
      left = leftDiff;
    }
    // check if the right side of the element is out of the page
    else if (leftDiff > 0 && rightDiff < 0) {
      left = this.offset.left - scrollLeft;
    }
    // check if all is OK and needs to return left position back
    else if (scrollLeft >= 0 && leftDiff >= 0 && currentLeft !== null) {
      left = "";

      // Set left coordinate if element is floated to the left/right
      if (this.styles.float !== "none") {
        left = leftDiff;

        // do not change left position if the current is the same
        if (left === Math.round(currentLeft)) {
          left = null;
        }
      }
    }

    if (left !== null) {
      setStyle(this.node, {
        left: left + "px"
      });
    }
  }

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

    this.limit = typeof value === "number" ? value : null;
  };

  /**
   * Update original values for element, such as styles and offset.
   */
  updateValues () {
    // Update styles of an element node
    this.styles = calculateStyles(this.node);

    // Update offset
    this.offset = calculateOffset(this.state === STATE.default ? this.node : this.placeholder, this.styles);

    // Dispatch the event
    this.node.dispatchEvent(createEvent(EVENT.update));
  }

  /**
   * Attach an event listener function for one event to the element node.
   * @public
   * @param {String} event One or more space-separated event types to listen for
   * @param {Function} listener A function to execute when the event is triggered
   */
  on (event, listener) {
    let events = event.split(" ");
    events = events.length > 1 ? events : event.split(",");

    if (events.length) {
      let i = events.length;
      while (i--) addEvent.call(this, events[i], listener);
    }
    else if (typeof event === "string") {
      addEvent.call(this, event, listener);
    }
    else if (typeof event !== "string" && typeof listener === "undefined") {
      throw new Error("Can't add listener for the element, please provide the correct type of event", this.node);
    }

    function addEvent (event, listener) {
      if (objectHasValue(EVENT, event)) {
        this.node.addEventListener(event, listener, false);
      } else {
        throw new Error("Unknown event type: " + event);
      }
    }

    return this;
  }

  /**
   * Remove an event listener.
   * @public
   * @param {String=} event One event type to stop listen for
   * @param {Function=} listener A listener function previously attached for the event node
   */
  off (event, listener) {
    if (typeof event === "string" && typeof listener === "function") {
      this.node.removeEventListener(event, listener, false);
    }
    else if (typeof event !== "string") {
      let cloneNode = this.node.cloneNode(true);

      this.node.parentNode.replaceChild(cloneNode, this.node);
      this.node = cloneNode;
    }
    else if (typeof listener === "undefined") {
      throw new Error("Can't remove listener for event: " + event + ". Please provide the listener.");
    }

    return this;
  }
}