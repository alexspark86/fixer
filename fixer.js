(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _fixer = __webpack_require__(1);

	var _fixer2 = _interopRequireDefault(_fixer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = _fixer2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _element = __webpack_require__(2);

	var _element2 = _interopRequireDefault(_element);

	var _utils = __webpack_require__(3);

	var _debounce = __webpack_require__(5);

	var _debounce2 = _interopRequireDefault(_debounce);

	var _throttleit = __webpack_require__(7);

	var _throttleit2 = _interopRequireDefault(_throttleit);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var documentSize = void 0;
	var windowSize = void 0;

	/**
	 * Class representing a fixer.
	 * @class
	 */

	var Fixer = function () {

	  /**
	   * Create fixer.
	   */
	  function Fixer() {
	    var _this = this;

	    _classCallCheck(this, Fixer);

	    // Save initial document height value
	    documentSize = (0, _utils.getDocumentSize)();
	    windowSize = (0, _utils.getWindowSize)();

	    // Create an array for registering elements to fix
	    this.elements = [];

	    // Listen to the page load and scroll
	    var onScroll = (0, _throttleit2.default)(function () {
	      return _this._onScroll((0, _utils.getScrolledPosition)());
	    }, 16);
	    window.addEventListener("scroll", onScroll);
	    window.addEventListener("load", onScroll);

	    // Listen to the page resize and recalculate elements width
	    var onResize = (0, _debounce2.default)(function () {
	      var currentWindowSize = (0, _utils.getWindowSize)();

	      if (windowSize.width !== currentWindowSize.width || windowSize.height !== currentWindowSize.height) {
	        // Update screen size value
	        windowSize = currentWindowSize;

	        // Reset all elements if screen was resized
	        _this.resetElements();
	      }
	    }, 4);
	    window.addEventListener("resize", onResize);

	    // Provide 'addElement' method for Element class to make possible chaining this method
	    _element2.default.prototype.addElement = this.addElement.bind(this);
	  }

	  /**
	   * Add an element to Fixer.
	   * @public
	   * @param {String|HTMLElement|jQuery} selector
	   * @param {defaults=} options
	   * @return {Fixer}
	   */


	  _createClass(Fixer, [{
	    key: "addElement",
	    value: function addElement(selector, options) {
	      var element = null;

	      if (selector) {
	        element = new _element2.default(selector, options);

	        if (element.node && element.node.tagName) {
	          // Add new element to array
	          this.elements.push(element);

	          // Sort elements array by top-offset for correct calculation of limit on scrolling
	          this.elements.sort(function (a, b) {
	            return a.offset.top - b.offset.top;
	          });
	        } else {
	          throw new Error("Can't add element '" + selector);
	        }
	      } else {
	        throw new Error("Please, provide selector or node to add new Fixer element");
	      }

	      // Re-fix elements in stack if needed
	      this._onScroll((0, _utils.getScrolledPosition)(), true);

	      return element;
	    }

	    /**
	     * Remove an element from Fixer.
	     * @public
	     * @param {String|HTMLElement|jQuery} selector
	     * @return {Fixer}
	     */

	  }, {
	    key: "removeElement",
	    value: function removeElement(selector) {
	      var element = (0, _utils.defineElement)(selector);
	      var i = this.elements.length;

	      while (i--) {
	        var item = this.elements[i];

	        if (item && item.hasOwnProperty('node') && item.node === element) {
	          var placeholder = item.placeholder;

	          item.unFix();
	          this.elements.splice(i, 1);

	          placeholder.parentNode.removeChild(placeholder);
	          placeholder = item.placeholder = null;

	          this.resetElements();

	          break;
	        }
	      }
	    }

	    /**
	     * Reset all elements position and calculated values.
	     * @public
	     */

	  }, {
	    key: "resetElements",
	    value: function resetElements() {
	      // UnFix all elements and update they values
	      this._unfixAll();

	      // Call onScroll method to reFix elements
	      this._onScroll((0, _utils.getScrolledPosition)(), true);
	    }

	    /**
	     * Getting height of the fixed element.
	     *
	     * There are two options for using:
	     * — You get current fixed height if the arguments did not assign.
	     * — You get height of elements that will fixed on the provided offset. It useful for scrolling to anchor.
	     *
	     * @public
	     * @param {String|Number|Function} [position = DEFAULTS.position] The side of the screen where elements should be fixed
	     * @param {Number|Function=} [offset = scrolled.top] The offset value relative to the document for which to calculate the height of the fixed elements
	     */

	  }, {
	    key: "getHeight",
	    value: function getHeight() {
	      var position = arguments.length <= 0 || arguments[0] === undefined ? _element.DEFAULTS.position : arguments[0];
	      var offset = arguments[1];

	      var elements = void 0;
	      var sum = 0;
	      var scrolled = (0, _utils.getScrolledPosition)();

	      // Check arguments and reassign them if necessary
	      if (typeof position === "number" || typeof position === "function") {
	        offset = position;
	        position = _element.DEFAULTS.position;
	      }

	      if (typeof offset === "undefined") {
	        return this._getCurrentHeight(position);
	      }
	      // Get offset value if provided function
	      else if (typeof offset === "function") {
	          offset = offset();
	        }
	        // Use current scroll position as offset if it doesn't provided
	        else if (typeof offset !== "number") {
	            offset = scrolled.top;
	          }

	      // Offset can't be larger than documentHeight, so choose a smaller value between them
	      offset = Math.min(offset, documentSize.height - windowSize.height);

	      // Unfix all elements to properly recalculate offset values
	      this._unfixAll();

	      // Filter and sort elements by position and scroll direction
	      elements = this.elements.filter(function (element) {
	        return element.options.position === position && element.options.stack === true;
	      }).sort(function (a, b) {
	        return position === _element.POSITION.top ? b.offset.top - a.offset.top : a.offset.top - b.offset.top;
	      });

	      // Iterate through the elements
	      var i = elements.length;
	      while (i--) {
	        var element = elements[i];

	        // Update value of the limit for the element to get accurate calculations
	        element.updateLimit();

	        // Get values for an element
	        var limit = element.limit;
	        var height = element.node.offsetHeight;
	        var stack = this._getStackHeight(element, { top: offset, left: scrolled.left });

	        var limitDiff = limit !== null ? limit - offset - stack : null;

	        // Check conditions
	        var isNeedToFix = element.options.position === _element.POSITION.top ? element.offset.top <= offset + stack : element.offset.bottom >= offset - stack + windowSize.height;

	        var isLimited = limitDiff !== null ? limitDiff < height : false;
	        var isHideByLimit = limitDiff !== null ? limitDiff <= 0 : false;

	        if (isLimited && !isHideByLimit) {
	          sum += limitDiff;
	        } else if (isNeedToFix && !isHideByLimit) {
	          sum += height;
	        }
	      }

	      // Clear elements variable
	      elements = null;

	      // Call onScroll method to reFix elements
	      this._onScroll((0, _utils.getScrolledPosition)(), true);

	      return sum;
	    }

	    /**
	     * Function listening scroll.
	     * @protected
	     * @param {Scrolled} scrolled Document scrolled values in pixels
	     * @param {Boolean=} forceFix Option to fix elements even if they're fixed
	     */

	  }, {
	    key: "_onScroll",
	    value: function _onScroll(scrolled, forceFix) {
	      // Check document height (needs to update element values if the document height has dynamically changed)
	      this._checkDocumentSize();

	      // Update document size
	      documentSize = (0, _utils.getDocumentSize)();

	      // Update offsets of limits before fix/unFix elements (to prevent fix limit of each element before it offset was calculated)
	      var i = this.elements.length;
	      while (i--) {
	        this.elements[i].updateLimit();
	      } // Iterate trough the elements to fix/unFix
	      i = this.elements.length;
	      while (i--) {
	        this._fixToggle(this.elements[i], scrolled, forceFix);
	      }
	    }

	    /**
	     * Function to fix/unFix an element.
	     * @protected
	     * @param {Element} element Element instance
	     * @param {Scrolled} scrolled Document scrolled values in pixels
	     * @param {Boolean=} [forceFix = element.state === STATE.default] Option to fix an element even if it fixed
	     */

	  }, {
	    key: "_fixToggle",
	    value: function _fixToggle(element, scrolled) {
	      var forceFix = arguments.length <= 2 || arguments[2] === undefined ? element.state === _element.STATE.default : arguments[2];

	      // Get values for an element
	      var offset = element.offset;
	      var limit = element.limit;
	      var stack = this._getStackHeight(element, scrolled);

	      // Check conditions
	      var isNeedToFix = element.options.position === _element.POSITION.top ? offset.top <= scrolled.top + stack : offset.bottom >= scrolled.top - stack + windowSize.height;
	      var isNeedToLimit = limit !== null ? limit <= scrolled.top + element.node.offsetHeight + stack : false;

	      // Check current state
	      var isLimited = element.state === _element.STATE.limited;
	      var isNotFixed = forceFix || isLimited;

	      // Fix/unFix or limit an element to its container or Set it to absolute (to limit)
	      if (isNeedToLimit && !isLimited) {
	        element.setLimited();
	      } else if (isNeedToFix && isNotFixed && !isNeedToLimit) {
	        element.fix(stack);
	      } else if (!isNeedToFix && element.state !== _element.STATE.default) {
	        element.unFix();
	      }

	      // Update horizontal position on horizontal scrolling
	      if (element.state === _element.STATE.fixed) {
	        element.adjustHorizontal(scrolled.left);
	      }

	      // Stretch element if is needed (experimental feature)
	      if (element.options.stretchTo !== null) {
	        element.stretch(scrolled);
	      }
	    }

	    /**
	     * Get stack height for an element.
	     * @protected
	     * @param {Element} element
	     * @param {Scrolled} scrolled Document scrolled values in pixels
	     */

	  }, {
	    key: "_getStackHeight",
	    value: function _getStackHeight(element, scrolled) {
	      var sum = 0;
	      var i = this.elements.length;

	      // Iterate through registered elements to determine whether they should be added to the element's stack
	      while (i--) {
	        var item = this.elements[i];

	        // Consider only items with the same position
	        if (element.options.position === item.options.position && item.options.stack === true) {

	          // Check if the item is on the way of element, when scrolling (up or down) - this will affect fixing the element
	          var isItemOnTheWay = element.options.position === _element.POSITION.top ? item.offset.top < element.offset.top : item.offset.top > element.offset.bottom;

	          if (isItemOnTheWay) {
	            // Check if an item will be hidden when reaching its 'limit' coordinate
	            var willHideByLimit = item.limit !== null && (element.options.position === _element.POSITION.top ? item.limit <= element.offset.top + scrolled.top : item.limit >= element.offset.bottom);

	            // If an item is on the way and it will not be limited, then add it's height to sum
	            if (!willHideByLimit) sum += item.node.offsetHeight || 0;
	          }
	        }
	      }

	      return sum;
	    }

	    /**
	     * Getting current height of a fixed elements by the provided position.
	     * @public
	     * @param {String=} [position = DEFAULTS.position]
	     * @return {Number}
	     */

	  }, {
	    key: "_getCurrentHeight",
	    value: function _getCurrentHeight() {
	      var position = arguments.length <= 0 || arguments[0] === undefined ? _element.DEFAULTS.position : arguments[0];

	      var fixedHeight = 0;
	      var limitedHeight = 0;
	      var i = this.elements.length;

	      // Iterate trough registered elements
	      while (i--) {
	        var element = this.elements[i];

	        // Check only elements attached to the provided side of the screen
	        if (position === element.options.position && element.options.stack === true) {

	          // Make sure the item state is fixed and then add it height to calculation
	          if (element.state === _element.STATE.fixed) {
	            fixedHeight += element.node.offsetHeight || 0;
	          }
	          // If item is limited then calculate it coordinate relative to the window.
	          // Depending on the item position we need to use top or bottom coordinate.
	          // Since a limited element may have a negative coordinate, we need to take positive value or 0 by Math.max method.
	          else if (element.state === _element.STATE.limited) {
	              var offset = element.node.getBoundingClientRect();
	              var height = position === _element.POSITION.top ? offset.bottom : offset.top;

	              limitedHeight = Math.max(limitedHeight, height);
	            }
	        }
	      }

	      // Return a larger value between sum of heights of fixed and limited elements.
	      return Math.max(fixedHeight, limitedHeight);
	    }

	    /**
	     * Update offsets of elements if the document's height has changed.
	     * @protected
	     */

	  }, {
	    key: "_checkDocumentSize",
	    value: function _checkDocumentSize() {
	      var currentDocumentSize = (0, _utils.getDocumentSize)();
	      var isWidthEqual = currentDocumentSize.width === documentSize.width || Math.abs(currentDocumentSize.width - documentSize.width) > 1;
	      var isHeightEqual = currentDocumentSize.height === documentSize.height || Math.abs(currentDocumentSize.height - documentSize.height) > 1;

	      // Check is the document size was changed
	      if (!isWidthEqual || !isHeightEqual) {
	        // Save current height of the document
	        documentSize = currentDocumentSize;

	        // Update values for each element
	        var i = this.elements.length;
	        while (i--) {
	          this.elements[i].updateValues();
	        }
	      }
	    }

	    /**
	     * UnFix all elements and update they values.
	     * @protected
	     */

	  }, {
	    key: "_unfixAll",
	    value: function _unfixAll() {
	      // UnFix all elements
	      var i = this.elements.length;
	      while (i--) {
	        this.elements[i].unFix();
	      }

	      // Update values of the elements
	      i = this.elements.length;
	      while (i--) {
	        this.elements[i].updateValues();
	      }
	    }
	  }]);

	  return Fixer;
	}();

	exports.default = Fixer;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DEFAULTS = exports.EVENT = exports.STATE = exports.POSITION = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(3);

	var _objectAssign = __webpack_require__(4);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Position string values.
	 * @readonly
	 * @enum {string}
	 */
	var POSITION = exports.POSITION = {
	  top: "top",
	  bottom: "bottom"
	};

	/**
	 * State string values.
	 * @readonly
	 * @enum {string}
	 */
	var STATE = exports.STATE = {
	  default: "default",
	  fixed: "fixed",
	  limited: "limited"
	};

	/**
	 * Event string values.
	 * @readonly
	 * @enum {string}
	 */
	var EVENT = exports.EVENT = {
	  init: "init",
	  update: "update",
	  fixed: "fixed",
	  preFixed: "preFixed",
	  unfixed: "unfixed",
	  preUnfixed: "preUnfixed",
	  limited: "limited",
	  preLimited: "preLimited",
	  stretched: "stretched"
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
	 * @property {Boolean} setWidth Property indicates whether to automatically calculate the width of the element on fixing
	 * @property {Boolean} stack Property indicates whether the height of the element count for fixing other elements
	 * @property {HTMLElement|String|Function} limit Selector, node or function of the limit for an element
	 * @property {HTMLElement|String|Function} stretchTo EXPERIMENTAL feature – Selector, node or function of the coordinate to stretch element vertically to it
	 */
	var DEFAULTS = exports.DEFAULTS = {
	  position: POSITION.top,
	  placeholder: true,
	  placeholderClass: "fixer-placeholder",
	  fixedClass: "_fixed",
	  setWidth: true,
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

	var Element = function () {

	  /**
	   * Create an element.
	   * @param {string|HTMLElement} selector
	   * @param {defaults} options
	   */
	  function Element(selector, options) {
	    _classCallCheck(this, Element);

	    // Extend element's options with initial- and default-options
	    (0, _objectAssign2.default)(this.options = {}, DEFAULTS, options);

	    if (options) {
	      this.options.limit = (0, _utils.defineElement)(this.options.limit);
	      this.options.stretchTo = (0, _utils.defineElement)(this.options.stretchTo);

	      // do not count element height for fixing other elements if it has option 'stretchTo'
	      this.options.stack = this.options.stretchTo === null;
	    }

	    // Init basic parameters
	    (0, _objectAssign2.default)(this, {
	      state: STATE.default,
	      node: (0, _utils.defineElement)(selector),
	      limit: null,
	      parent: null
	    });

	    if (this.node && this.node.tagName) {
	      // Saving original styles of an element node
	      this.styles = (0, _utils.calculateStyles)(this.node);

	      // Saving original offsets of an element node
	      this.offset = (0, _utils.calculateOffset)(this.node, this.styles);

	      // Creating placeholder if needed
	      this.placeholder = this.options.placeholder ? this._createPlaceholder() : null;

	      // Set offset parent of the node
	      this.parent = this.node.offsetParent;

	      // Dispatch the event
	      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.init));

	      // Hack for mobile Safari to properly fix element while user scrolls a page
	      if (this.styles.transform === "none") {
	        (0, _utils.setStyle)(this.node, { transform: "translateZ(0)" });
	      }
	    }
	  }

	  /**
	   * Create placeholder node.
	   * @protected
	   * @return {HTMLElement}
	   */


	  _createClass(Element, [{
	    key: "_createPlaceholder",
	    value: function _createPlaceholder() {
	      var placeholder = document.createElement("span");

	      // Set placeholder className
	      placeholder.className = this.options.placeholderClass;

	      // Init styles for placeholder
	      var cssProperties = {
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
	        height: this.node.offsetHeight + "px",
	        maxWidth: this.styles.maxWidth
	      };

	      // Add width property if needed
	      if (this.options.setWidth) {
	        cssProperties.width = this.node.offsetWidth + "px";
	      }

	      // Add styles for placeholder node
	      (0, _utils.setStyle)(placeholder, cssProperties);

	      // Insert placeholder into document
	      this.node.parentNode.insertBefore(placeholder, this.node.nextSibling);

	      return placeholder;
	    }

	    /**
	     * Fix an element's node.
	     * @param {number} offset
	     */

	  }, {
	    key: "fix",
	    value: function fix(offset) {
	      var _cssProperties;

	      var element = this.node;
	      var placeholder = this.placeholder;

	      // Dispatch the event

	      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.preFixed));

	      // Init styles for the element node
	      var cssProperties = (_cssProperties = {
	        position: "fixed"
	      }, _defineProperty(_cssProperties, this.options.position, offset + "px"), _defineProperty(_cssProperties, "left", this.offset.left + "px"), _defineProperty(_cssProperties, "zIndex", this.styles.zIndex === "auto" ? "100" : this.styles.zIndex), _defineProperty(_cssProperties, "marginTop", 0), _defineProperty(_cssProperties, "marginBottom", 0), _defineProperty(_cssProperties, "width", this.styles.width), _cssProperties);

	      // Set styles for a node
	      (0, _utils.setStyle)(element, cssProperties);

	      // Set styles for placeholder node
	      if (placeholder) {
	        (0, _utils.setStyle)(placeholder, {
	          display: this.styles.display,
	          width: this.options.setWidth ? this.node.offsetWidth + "px" : ""
	        });
	      }

	      // Add fixed className for the element node
	      (0, _utils.addClass)(element, this.options.fixedClass);

	      // Set fixed state for the element
	      this.state = STATE.fixed;

	      // Dispatch the event
	      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.fixed));
	    }

	    /**
	     * Unfix an element's node (return its state to initial) and update properties.
	     */

	  }, {
	    key: "unFix",
	    value: function unFix() {
	      var _setStyle;

	      var element = this.node;
	      var placeholder = this.placeholder;

	      // Dispatch the event

	      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.preUnfixed));

	      (0, _utils.setStyle)(element, (_setStyle = {
	        position: ""
	      }, _defineProperty(_setStyle, this.options.position, ""), _defineProperty(_setStyle, "left", ""), _defineProperty(_setStyle, "zIndex", ""), _defineProperty(_setStyle, "marginTop", ""), _defineProperty(_setStyle, "marginBottom", ""), _defineProperty(_setStyle, "width", ""), _setStyle));

	      if (placeholder) {
	        (0, _utils.setStyle)(placeholder, {
	          display: "none"
	        });
	      }

	      (0, _utils.removeClass)(element, this.options.fixedClass);

	      // Update state
	      this.state = STATE.default;

	      // Dispatch the event
	      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.unfixed));
	    }
	  }, {
	    key: "setLimited",


	    /**
	     * Set position absolute with correct coordinates relative to parent to properly fix an element by its limiter.
	     */
	    value: function setLimited() {
	      var element = this.node;
	      var offset = this.offset;
	      var limit = this.limit;
	      var parent = this.parent;
	      var placeholder = this.placeholder;
	      var styles = this.styles;


	      var parentOffset = (0, _utils.calculateOffset)(parent);
	      var offsetTop = limit - parentOffset.top - element.offsetHeight;
	      var offsetLeft = offset.left - parentOffset.left;

	      // Dispatch the event
	      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.preLimited));

	      // Init styles for the element
	      var cssProperties = {
	        position: "absolute",
	        top: offsetTop + "px",
	        left: offsetLeft + "px",
	        bottom: "auto",
	        right: "auto",
	        zIndex: this.styles.zIndex === "auto" ? "100" : this.styles.zIndex,
	        marginTop: 0,
	        marginBottom: 0
	      };

	      // Add width property if needed
	      if (this.options.setWidth) {
	        cssProperties.width = this.styles.width;
	      }

	      // Set styles for the element node
	      (0, _utils.setStyle)(element, cssProperties);

	      // Set styles for placeholder node
	      if (placeholder) {
	        (0, _utils.setStyle)(placeholder, {
	          display: styles.display
	        });
	      }

	      // Add fixed className for an element node
	      (0, _utils.addClass)(element, this.options.fixedClass);

	      // Update state
	      this.state = STATE.limited;

	      // Dispatch the event
	      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.limited));
	    }
	  }, {
	    key: "stretch",


	    /**
	     * Stretch element vertically to the provided element or offset value.
	     */
	    value: function stretch(scrolled) {
	      var stretchTo = getStretchOffset(this.options.stretchTo, this.options.position) - scrolled.top;

	      var _node$getBoundingClie = this.node.getBoundingClientRect();

	      var height = _node$getBoundingClie.height;
	      var top = _node$getBoundingClie.top;

	      var _getWindowSize = (0, _utils.getWindowSize)();

	      var windowHeight = _getWindowSize.height;


	      stretchTo = (windowHeight - stretchTo < 0 ? windowHeight : stretchTo) - top;

	      (0, _utils.setStyle)(this.node, {
	        height: stretchTo + "px"
	      });

	      // Dispatch the event if element height changed
	      if (height !== stretchTo) {
	        this.node.dispatchEvent((0, _utils.createEvent)(EVENT.stretched));
	      }

	      // Calculate stretch offset
	      function getStretchOffset(limit, position) {
	        var value = void 0;

	        // Call function if it represented
	        if (typeof limit === "function") {
	          limit = limit();
	        }

	        // Set limit value
	        if (typeof limit === "number") {
	          value = limit;
	        }
	        // If limit is {HTMLElement} then set it offset for the value
	        else if (limit !== null && (typeof limit === "undefined" ? "undefined" : _typeof(limit)) === "object" && limit.tagName !== "undefined") {
	            value = (0, _utils.calculateOffset)(limit)[position];
	          }

	        return typeof value === "number" ? value : null;
	      }
	    }

	    /**
	     * Adjusting horizontal position of an element relative to scrollLeft if page is scrolled horizontally.
	     * @param {Number} scrollLeft
	     */

	  }, {
	    key: "adjustHorizontal",
	    value: function adjustHorizontal(scrollLeft) {
	      var leftDiff = Math.round(this.offset.left - scrollLeft);
	      var rightDiff = scrollLeft + document.documentElement.offsetWidth - this.offset.right;
	      var currentLeft = parseInt(this.node.style.left) || null;

	      var left = null;

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
	        (0, _utils.setStyle)(this.node, {
	          left: left + "px"
	        });
	      }
	    }

	    /**
	     * Update actual value of limit for en element.
	     */

	  }, {
	    key: "updateLimit",
	    value: function updateLimit() {
	      var limit = this.options.limit;
	      var value = void 0;

	      // Call function if it represented
	      if (typeof limit === "function") {
	        limit = limit();
	      }

	      // Set limit value
	      if (typeof limit === "number") {
	        value = limit;
	      }
	      // If limit is {HTMLElement} then set it offset for the value
	      else if (limit !== null && (typeof limit === "undefined" ? "undefined" : _typeof(limit)) === "object" && limit.tagName !== "undefined") {
	          value = (0, _utils.calculateOffset)(limit)[this.options.position];
	        }

	      this.limit = typeof value === "number" ? value : null;
	    }
	  }, {
	    key: "updateValues",


	    /**
	     * Update original values for element, such as styles and offset.
	     */
	    value: function updateValues() {
	      // Update styles of an element node
	      this.styles = (0, _utils.calculateStyles)(this.node);

	      // Update offset
	      this.offset = (0, _utils.calculateOffset)(this.state === STATE.default ? this.node : this.placeholder, this.styles);

	      // Dispatch the event
	      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.update));
	    }

	    /**
	     * Attach an event listener function for one event to the element node.
	     * @public
	     * @param {String} event One or more space-separated event types to listen for
	     * @param {Function} listener A function to execute when the event is triggered
	     */

	  }, {
	    key: "on",
	    value: function on(event, listener) {
	      var events = event.split(" ");
	      events = events.length > 1 ? events : event.split(",");

	      if (events.length) {
	        var i = events.length;
	        while (i--) {
	          addEvent.call(this, events[i], listener);
	        }
	      } else if (typeof event === "string") {
	        addEvent.call(this, event, listener);
	      } else if (typeof event !== "string" && typeof listener === "undefined") {
	        throw new Error("Can't add listener for the element, please provide the correct type of event", this.node);
	      }

	      function addEvent(event, listener) {
	        if ((0, _utils.objectHasValue)(EVENT, event)) {
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

	  }, {
	    key: "off",
	    value: function off(event, listener) {
	      if (typeof event === "string" && typeof listener === "function") {
	        this.node.removeEventListener(event, listener, false);
	      } else if (typeof event !== "string") {
	        var cloneNode = this.node.cloneNode(true);

	        this.node.parentNode.replaceChild(cloneNode, this.node);
	        this.node = cloneNode;
	      } else if (typeof listener === "undefined") {
	        throw new Error("Can't remove listener for event: " + event + ". Please provide the listener.");
	      }

	      return this;
	    }
	  }]);

	  return Element;
	}();

	exports.default = Element;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.getDocumentSize = getDocumentSize;
	exports.getWindowSize = getWindowSize;
	exports.defineElement = defineElement;
	exports.calculateStyles = calculateStyles;
	exports.calculateOffset = calculateOffset;
	exports.getScrolledPosition = getScrolledPosition;
	exports.setStyle = setStyle;
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.objectHasValue = objectHasValue;
	exports.createEvent = createEvent;

	var _objectAssign = __webpack_require__(4);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Get actual width and height of the document.
	 * @return {Object}
	 */
	function getDocumentSize() {
	  var body = document.body;
	  var html = document.documentElement;
	  var _document = document;
	  var width = _document.width;
	  var height = _document.height;


	  if (typeof width === "undefined" && typeof height === "undefined" && body && html) {
	    width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
	    height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
	  } else if (!body && !html) {
	    throw new Error("Can't calculate document size. Make sure that the method is called when the document is ready.");
	  }

	  return { width: width, height: height };
	}

	/**
	 * Get width and height of the viewport.
	 * @return {Object}
	 */
	function getWindowSize() {
	  var body = document.body;
	  var html = document.documentElement;
	  var width = void 0,
	      height = void 0;

	  if (window || body || html) {
	    width = window.innerWidth || html.clientWidth || body.clientWidth;
	    height = window.innerHeight || html.clientHeight || body.clientHeight;
	  } else {
	    throw new Error("Can't calculate screen size. Make sure that the method is called when the document is ready.");
	  }

	  return { width: width, height: height };
	}

	/**
	 * Defining an element.
	 * @param {String|jQuery|HTMLElement|Function} element
	 * @return {HTMLElement}
	 */
	function defineElement(element) {
	  if (typeof element === "string") {
	    element = document.querySelector(element);
	  } else if ((typeof element === "undefined" ? "undefined" : _typeof(element)) === "object" && element !== null && typeof element.jquery !== "undefined" && element.length || (typeof $ === "undefined" ? "undefined" : _typeof($)) === "object" && element instanceof $ && element.length) {
	    element = element[0];
	  }

	  return element;
	}

	/**
	 * Calculating browser styles for an element.
	 * @param {HTMLElement} element
	 */
	function calculateStyles(element) {
	  // Get computed browser styles
	  var styles = window.getComputedStyle(element, null);

	  // IE computed width
	  var currentStyle = element.currentStyle;

	  // Set computed width from IE or from other browser
	  var width = currentStyle && currentStyle.width !== "auto" ? currentStyle.width : styles.width;

	  // Return new object with selected styles properties
	  return (0, _objectAssign2.default)({}, {
	    position: styles.position,
	    top: styles.top,
	    zIndex: styles.zIndex,
	    float: styles.float,
	    clear: styles.clear,
	    display: styles.display,
	    marginTop: styles.marginTop,
	    marginRight: styles.marginRight,
	    marginBottom: styles.marginBottom,
	    marginLeft: styles.marginLeft,
	    width: width,
	    maxWidth: styles.maxWidth
	  });
	}

	/**
	 * Calculating offsets of the element from each side of the document.
	 * @param {HTMLElement} element
	 * @param {Object=} styles
	 *
	 * @typedef {Object} Offset
	 * @property {Number} top
	 * @property {Number} bottom
	 * @property {Number} left
	 * @property {Number} right
	 *
	 * @return {Offset}
	 */
	function calculateOffset(element, styles) {
	  var rect = element.getBoundingClientRect();
	  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
	  var marginLeft = styles ? parseInt(styles.marginLeft) : 0;

	  return {
	    top: rect.top + scrollTop,
	    bottom: rect.bottom + scrollTop,
	    left: rect.left + scrollLeft - marginLeft,
	    right: rect.right + scrollLeft - marginLeft
	  };
	}

	/**
	 * Getting scrollbar position.
	 *
	 * @typedef {Object} Scrolled
	 * @property {Number} top
	 * @property {Number} left
	 *
	 * @return {Scrolled}
	 */
	function getScrolledPosition() {
	  return {
	    top: window.pageYOffset || document.documentElement.scrollTop,
	    left: window.pageXOffset || document.documentElement.scrollLeft
	  };
	}

	/**
	 * Set styles for the node of an element.
	 * @param {HTMLElement} element
	 * @param {Object} properties
	 */
	function setStyle(element, properties) {
	  (0, _objectAssign2.default)(element.style, properties);
	}

	/**
	 * Add className for element node.
	 * @param {HTMLElement} element
	 * @param {String} className
	 */
	function addClass(element, className) {
	  if (document.documentElement.classList && !element.classList.contains(className)) {
	    element.classList.add(className);
	  } else if (element.className.indexOf(className) === -1) {
	    element.className += " " + className;
	  }
	}

	/**
	 * Remove className from element node.
	 * @param {HTMLElement} element
	 * @param {String} className
	 */
	function removeClass(element, className) {
	  if (document.documentElement.classList) {
	    element.classList.remove(className);
	  } else {
	    element.className = element.className.replace(className, "");
	  }
	}

	/**
	 * Checks does object contains provided value.
	 * @param {Object} object
	 * @param {*} value
	 */
	function objectHasValue(object, value) {
	  for (var key in object) {
	    if (object.hasOwnProperty(key) && object[key] === value) {
	      return true;
	    }
	  }

	  return false;
	}

	/**
	 * Create cross-browser event.
	 * @param {String} type
	 * @return {Event}
	 */
	function createEvent(type) {
	  var event = null;

	  try {
	    event = new Event(type);
	  } catch (error) {
	    event = document.createEvent("Event");
	    event.initEvent(type, { bubbles: false, cancelable: false });
	  }

	  return event;
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var now = __webpack_require__(6);

	/**
	 * Returns a function, that, as long as it continues to be invoked, will not
	 * be triggered. The function will be called after it stops being called for
	 * N milliseconds. If `immediate` is passed, trigger the function on the
	 * leading edge, instead of the trailing.
	 *
	 * @source underscore.js
	 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
	 * @param {Function} function to wrap
	 * @param {Number} timeout in ms (`100`)
	 * @param {Boolean} whether to execute at the beginning (`false`)
	 * @api public
	 */

	module.exports = function debounce(func, wait, immediate){
	  var timeout, args, context, timestamp, result;
	  if (null == wait) wait = 100;

	  function later() {
	    var last = now() - timestamp;

	    if (last < wait && last > 0) {
	      timeout = setTimeout(later, wait - last);
	    } else {
	      timeout = null;
	      if (!immediate) {
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      }
	    }
	  };

	  return function debounced() {
	    context = this;
	    args = arguments;
	    timestamp = now();
	    var callNow = immediate && !timeout;
	    if (!timeout) timeout = setTimeout(later, wait);
	    if (callNow) {
	      result = func.apply(context, args);
	      context = args = null;
	    }

	    return result;
	  };
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = Date.now || now

	function now() {
	    return new Date().getTime()
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = throttle;

	/**
	 * Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
	 *
	 * @param {Function} func Function to wrap.
	 * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
	 * @return {Function} A new function that wraps the `func` function passed in.
	 */

	function throttle (func, wait) {
	  var ctx, args, rtn, timeoutID; // caching
	  var last = 0;

	  return function throttled () {
	    ctx = this;
	    args = arguments;
	    var delta = new Date() - last;
	    if (!timeoutID)
	      if (delta >= wait) call();
	      else timeoutID = setTimeout(call, wait - delta);
	    return rtn;
	  };

	  function call () {
	    timeoutID = 0;
	    last = +new Date();
	    rtn = func.apply(ctx, args);
	    ctx = null;
	    args = null;
	  }
	}


/***/ }
/******/ ])
});
;