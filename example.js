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

	"use strict";

	var _fixer = __webpack_require__(1);

	var _fixer2 = _interopRequireDefault(_fixer);

	var _webfontloader = __webpack_require__(8);

	var _webfontloader2 = _interopRequireDefault(_webfontloader);

	__webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_webfontloader2.default.load({
	  google: {
	    families: ["Merriweather", "PT Serif"]
	  }
	});

	document.addEventListener("DOMContentLoaded", function () {
	  var fixer = new _fixer2.default();

	  var menu = fixer.addElement(".menu", { setWidth: false });

	  menu.on("fixed", function (e) {
	    console.log(this);
	  });

	  fixer.addElement("#side-block-1", {
	    limit: "#side-block-2"
	  }).addElement("#side-block-2", {
	    limit: ".bottom-block"
	  }).addElement("#bottom-block-1", {
	    position: "bottom"
	  }).addElement("#bottom-block-2", {
	    position: "bottom"
	  });np;
	}, false);

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
	      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _element.DEFAULTS.position;
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
	      var forceFix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : element.state === _element.STATE.default;

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
	      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _element.DEFAULTS.position;

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

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

	      var element = this.node,
	          placeholder = this.placeholder;

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

	      var element = this.node,
	          placeholder = this.placeholder;

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
	      var element = this.node,
	          offset = this.offset,
	          limit = this.limit,
	          parent = this.parent,
	          placeholder = this.placeholder,
	          styles = this.styles;


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
	      var top = this.node.getBoundingClientRect().top;

	      var _getWindowSize = (0, _utils.getWindowSize)(),
	          windowHeight = _getWindowSize.height;

	      stretchTo = windowHeight - stretchTo < 0 ? windowHeight : stretchTo;

	      (0, _utils.setStyle)(this.node, {
	        height: stretchTo - top + "px"
	      });

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

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
	  var _document = document,
	      width = _document.width,
	      height = _document.height;


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
	    var doesntBubble = false;
	    var isntCancelable = false;

	    event = document.createEvent("Event");
	    event.initEvent(type, doesntBubble, isntCancelable);
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Web Font Loader v1.6.27 - (c) Adobe Systems, Google. License: Apache 2.0 */(function(){function aa(a,b,c){return a.call.apply(a.bind,arguments)}function ba(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function p(a,b,c){p=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?aa:ba;return p.apply(null,arguments)}var q=Date.now||function(){return+new Date};function ca(a,b){this.a=a;this.m=b||a;this.c=this.m.document}var da=!!window.FontFace;function t(a,b,c,d){b=a.c.createElement(b);if(c)for(var e in c)c.hasOwnProperty(e)&&("style"==e?b.style.cssText=c[e]:b.setAttribute(e,c[e]));d&&b.appendChild(a.c.createTextNode(d));return b}function u(a,b,c){a=a.c.getElementsByTagName(b)[0];a||(a=document.documentElement);a.insertBefore(c,a.lastChild)}function v(a){a.parentNode&&a.parentNode.removeChild(a)}
	function w(a,b,c){b=b||[];c=c||[];for(var d=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=!1,g=0;g<d.length;g+=1)if(b[e]===d[g]){f=!0;break}f||d.push(b[e])}b=[];for(e=0;e<d.length;e+=1){f=!1;for(g=0;g<c.length;g+=1)if(d[e]===c[g]){f=!0;break}f||b.push(d[e])}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function y(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return!0;return!1}
	function z(a){if("string"===typeof a.f)return a.f;var b=a.m.location.protocol;"about:"==b&&(b=a.a.location.protocol);return"https:"==b?"https:":"http:"}function ea(a){return a.m.location.hostname||a.a.location.hostname}
	function A(a,b,c){function d(){k&&e&&f&&(k(g),k=null)}b=t(a,"link",{rel:"stylesheet",href:b,media:"all"});var e=!1,f=!0,g=null,k=c||null;da?(b.onload=function(){e=!0;d()},b.onerror=function(){e=!0;g=Error("Stylesheet failed to load");d()}):setTimeout(function(){e=!0;d()},0);u(a,"head",b)}
	function B(a,b,c,d){var e=a.c.getElementsByTagName("head")[0];if(e){var f=t(a,"script",{src:b}),g=!1;f.onload=f.onreadystatechange=function(){g||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(g=!0,c&&c(null),f.onload=f.onreadystatechange=null,"HEAD"==f.parentNode.tagName&&e.removeChild(f))};e.appendChild(f);setTimeout(function(){g||(g=!0,c&&c(Error("Script load timeout")))},d||5E3);return f}return null};function C(){this.a=0;this.c=null}function D(a){a.a++;return function(){a.a--;E(a)}}function F(a,b){a.c=b;E(a)}function E(a){0==a.a&&a.c&&(a.c(),a.c=null)};function G(a){this.a=a||"-"}G.prototype.c=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.a)};function H(a,b){this.c=a;this.f=4;this.a="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.a=c[1],this.f=parseInt(c[2],10))}function fa(a){return I(a)+" "+(a.f+"00")+" 300px "+J(a.c)}function J(a){var b=[];a=a.split(/,\s*/);for(var c=0;c<a.length;c++){var d=a[c].replace(/['"]/g,"");-1!=d.indexOf(" ")||/^\d/.test(d)?b.push("'"+d+"'"):b.push(d)}return b.join(",")}function K(a){return a.a+a.f}function I(a){var b="normal";"o"===a.a?b="oblique":"i"===a.a&&(b="italic");return b}
	function ga(a){var b=4,c="n",d=null;a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10))));return c+b};function ha(a,b){this.c=a;this.f=a.m.document.documentElement;this.h=b;this.a=new G("-");this.j=!1!==b.events;this.g=!1!==b.classes}function ia(a){a.g&&w(a.f,[a.a.c("wf","loading")]);L(a,"loading")}function M(a){if(a.g){var b=y(a.f,a.a.c("wf","active")),c=[],d=[a.a.c("wf","loading")];b||c.push(a.a.c("wf","inactive"));w(a.f,c,d)}L(a,"inactive")}function L(a,b,c){if(a.j&&a.h[b])if(c)a.h[b](c.c,K(c));else a.h[b]()};function ja(){this.c={}}function ka(a,b,c){var d=[],e;for(e in b)if(b.hasOwnProperty(e)){var f=a.c[e];f&&d.push(f(b[e],c))}return d};function N(a,b){this.c=a;this.f=b;this.a=t(this.c,"span",{"aria-hidden":"true"},this.f)}function O(a){u(a.c,"body",a.a)}function P(a){return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+J(a.c)+";"+("font-style:"+I(a)+";font-weight:"+(a.f+"00")+";")};function Q(a,b,c,d,e,f){this.g=a;this.j=b;this.a=d;this.c=c;this.f=e||3E3;this.h=f||void 0}Q.prototype.start=function(){var a=this.c.m.document,b=this,c=q(),d=new Promise(function(d,e){function k(){q()-c>=b.f?e():a.fonts.load(fa(b.a),b.h).then(function(a){1<=a.length?d():setTimeout(k,25)},function(){e()})}k()}),e=new Promise(function(a,d){setTimeout(d,b.f)});Promise.race([e,d]).then(function(){b.g(b.a)},function(){b.j(b.a)})};function R(a,b,c,d,e,f,g){this.v=a;this.B=b;this.c=c;this.a=d;this.s=g||"BESbswy";this.f={};this.w=e||3E3;this.u=f||null;this.o=this.j=this.h=this.g=null;this.g=new N(this.c,this.s);this.h=new N(this.c,this.s);this.j=new N(this.c,this.s);this.o=new N(this.c,this.s);a=new H(this.a.c+",serif",K(this.a));a=P(a);this.g.a.style.cssText=a;a=new H(this.a.c+",sans-serif",K(this.a));a=P(a);this.h.a.style.cssText=a;a=new H("serif",K(this.a));a=P(a);this.j.a.style.cssText=a;a=new H("sans-serif",K(this.a));a=
	P(a);this.o.a.style.cssText=a;O(this.g);O(this.h);O(this.j);O(this.o)}var S={D:"serif",C:"sans-serif"},T=null;function U(){if(null===T){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);T=!!a&&(536>parseInt(a[1],10)||536===parseInt(a[1],10)&&11>=parseInt(a[2],10))}return T}R.prototype.start=function(){this.f.serif=this.j.a.offsetWidth;this.f["sans-serif"]=this.o.a.offsetWidth;this.A=q();la(this)};
	function ma(a,b,c){for(var d in S)if(S.hasOwnProperty(d)&&b===a.f[S[d]]&&c===a.f[S[d]])return!0;return!1}function la(a){var b=a.g.a.offsetWidth,c=a.h.a.offsetWidth,d;(d=b===a.f.serif&&c===a.f["sans-serif"])||(d=U()&&ma(a,b,c));d?q()-a.A>=a.w?U()&&ma(a,b,c)&&(null===a.u||a.u.hasOwnProperty(a.a.c))?V(a,a.v):V(a,a.B):na(a):V(a,a.v)}function na(a){setTimeout(p(function(){la(this)},a),50)}function V(a,b){setTimeout(p(function(){v(this.g.a);v(this.h.a);v(this.j.a);v(this.o.a);b(this.a)},a),0)};function W(a,b,c){this.c=a;this.a=b;this.f=0;this.o=this.j=!1;this.s=c}var X=null;W.prototype.g=function(a){var b=this.a;b.g&&w(b.f,[b.a.c("wf",a.c,K(a).toString(),"active")],[b.a.c("wf",a.c,K(a).toString(),"loading"),b.a.c("wf",a.c,K(a).toString(),"inactive")]);L(b,"fontactive",a);this.o=!0;oa(this)};
	W.prototype.h=function(a){var b=this.a;if(b.g){var c=y(b.f,b.a.c("wf",a.c,K(a).toString(),"active")),d=[],e=[b.a.c("wf",a.c,K(a).toString(),"loading")];c||d.push(b.a.c("wf",a.c,K(a).toString(),"inactive"));w(b.f,d,e)}L(b,"fontinactive",a);oa(this)};function oa(a){0==--a.f&&a.j&&(a.o?(a=a.a,a.g&&w(a.f,[a.a.c("wf","active")],[a.a.c("wf","loading"),a.a.c("wf","inactive")]),L(a,"active")):M(a.a))};function pa(a){this.j=a;this.a=new ja;this.h=0;this.f=this.g=!0}pa.prototype.load=function(a){this.c=new ca(this.j,a.context||this.j);this.g=!1!==a.events;this.f=!1!==a.classes;qa(this,new ha(this.c,a),a)};
	function ra(a,b,c,d,e){var f=0==--a.h;(a.f||a.g)&&setTimeout(function(){var a=e||null,k=d||null||{};if(0===c.length&&f)M(b.a);else{b.f+=c.length;f&&(b.j=f);var h,m=[];for(h=0;h<c.length;h++){var l=c[h],n=k[l.c],r=b.a,x=l;r.g&&w(r.f,[r.a.c("wf",x.c,K(x).toString(),"loading")]);L(r,"fontloading",x);r=null;if(null===X)if(window.FontFace){var x=/Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent),ya=/OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent)&&/Apple/.exec(window.navigator.vendor);
	X=x?42<parseInt(x[1],10):ya?!1:!0}else X=!1;X?r=new Q(p(b.g,b),p(b.h,b),b.c,l,b.s,n):r=new R(p(b.g,b),p(b.h,b),b.c,l,b.s,a,n);m.push(r)}for(h=0;h<m.length;h++)m[h].start()}},0)}function qa(a,b,c){var d=[],e=c.timeout;ia(b);var d=ka(a.a,c,a.c),f=new W(a.c,b,e);a.h=d.length;b=0;for(c=d.length;b<c;b++)d[b].load(function(b,d,c){ra(a,f,b,d,c)})};function sa(a,b){this.c=a;this.a=b}function ta(a,b,c){var d=z(a.c);a=(a.a.api||"fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/,"");return d+"//"+a+"/"+b+".js"+(c?"?v="+c:"")}
	sa.prototype.load=function(a){function b(){if(f["__mti_fntLst"+d]){var c=f["__mti_fntLst"+d](),e=[],h;if(c)for(var m=0;m<c.length;m++){var l=c[m].fontfamily;void 0!=c[m].fontStyle&&void 0!=c[m].fontWeight?(h=c[m].fontStyle+c[m].fontWeight,e.push(new H(l,h))):e.push(new H(l))}a(e)}else setTimeout(function(){b()},50)}var c=this,d=c.a.projectId,e=c.a.version;if(d){var f=c.c.m;B(this.c,ta(c,d,e),function(e){e?a([]):(f["__MonotypeConfiguration__"+d]=function(){return c.a},b())}).id="__MonotypeAPIScript__"+
	d}else a([])};function ua(a,b){this.c=a;this.a=b}ua.prototype.load=function(a){var b,c,d=this.a.urls||[],e=this.a.families||[],f=this.a.testStrings||{},g=new C;b=0;for(c=d.length;b<c;b++)A(this.c,d[b],D(g));var k=[];b=0;for(c=e.length;b<c;b++)if(d=e[b].split(":"),d[1])for(var h=d[1].split(","),m=0;m<h.length;m+=1)k.push(new H(d[0],h[m]));else k.push(new H(d[0]));F(g,function(){a(k,f)})};function va(a,b,c){a?this.c=a:this.c=b+wa;this.a=[];this.f=[];this.g=c||""}var wa="//fonts.googleapis.com/css";function xa(a,b){for(var c=b.length,d=0;d<c;d++){var e=b[d].split(":");3==e.length&&a.f.push(e.pop());var f="";2==e.length&&""!=e[1]&&(f=":");a.a.push(e.join(f))}}
	function za(a){if(0==a.a.length)throw Error("No fonts to load!");if(-1!=a.c.indexOf("kit="))return a.c;for(var b=a.a.length,c=[],d=0;d<b;d++)c.push(a.a[d].replace(/ /g,"+"));b=a.c+"?family="+c.join("%7C");0<a.f.length&&(b+="&subset="+a.f.join(","));0<a.g.length&&(b+="&text="+encodeURIComponent(a.g));return b};function Aa(a){this.f=a;this.a=[];this.c={}}
	var Ba={latin:"BESbswy","latin-ext":"\u00e7\u00f6\u00fc\u011f\u015f",cyrillic:"\u0439\u044f\u0416",greek:"\u03b1\u03b2\u03a3",khmer:"\u1780\u1781\u1782",Hanuman:"\u1780\u1781\u1782"},Ca={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},Da={i:"i",italic:"i",n:"n",normal:"n"},
	Ea=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
	function Fa(a){for(var b=a.f.length,c=0;c<b;c++){var d=a.f[c].split(":"),e=d[0].replace(/\+/g," "),f=["n4"];if(2<=d.length){var g;var k=d[1];g=[];if(k)for(var k=k.split(","),h=k.length,m=0;m<h;m++){var l;l=k[m];if(l.match(/^[\w-]+$/)){var n=Ea.exec(l.toLowerCase());if(null==n)l="";else{l=n[2];l=null==l||""==l?"n":Da[l];n=n[1];if(null==n||""==n)n="4";else var r=Ca[n],n=r?r:isNaN(n)?"4":n.substr(0,1);l=[l,n].join("")}}else l="";l&&g.push(l)}0<g.length&&(f=g);3==d.length&&(d=d[2],g=[],d=d?d.split(","):
	g,0<d.length&&(d=Ba[d[0]])&&(a.c[e]=d))}a.c[e]||(d=Ba[e])&&(a.c[e]=d);for(d=0;d<f.length;d+=1)a.a.push(new H(e,f[d]))}};function Ga(a,b){this.c=a;this.a=b}var Ha={Arimo:!0,Cousine:!0,Tinos:!0};Ga.prototype.load=function(a){var b=new C,c=this.c,d=new va(this.a.api,z(c),this.a.text),e=this.a.families;xa(d,e);var f=new Aa(e);Fa(f);A(c,za(d),D(b));F(b,function(){a(f.a,f.c,Ha)})};function Ia(a,b){this.c=a;this.a=b}Ia.prototype.load=function(a){var b=this.a.id,c=this.c.m;b?B(this.c,(this.a.api||"https://use.typekit.net")+"/"+b+".js",function(b){if(b)a([]);else if(c.Typekit&&c.Typekit.config&&c.Typekit.config.fn){b=c.Typekit.config.fn;for(var e=[],f=0;f<b.length;f+=2)for(var g=b[f],k=b[f+1],h=0;h<k.length;h++)e.push(new H(g,k[h]));try{c.Typekit.load({events:!1,classes:!1,async:!0})}catch(m){}a(e)}},2E3):a([])};function Ja(a,b){this.c=a;this.f=b;this.a=[]}Ja.prototype.load=function(a){var b=this.f.id,c=this.c.m,d=this;b?(c.__webfontfontdeckmodule__||(c.__webfontfontdeckmodule__={}),c.__webfontfontdeckmodule__[b]=function(b,c){for(var g=0,k=c.fonts.length;g<k;++g){var h=c.fonts[g];d.a.push(new H(h.name,ga("font-weight:"+h.weight+";font-style:"+h.style)))}a(d.a)},B(this.c,z(this.c)+(this.f.api||"//f.fontdeck.com/s/css/js/")+ea(this.c)+"/"+b+".js",function(b){b&&a([])})):a([])};var Y=new pa(window);Y.a.c.custom=function(a,b){return new ua(b,a)};Y.a.c.fontdeck=function(a,b){return new Ja(b,a)};Y.a.c.monotype=function(a,b){return new sa(b,a)};Y.a.c.typekit=function(a,b){return new Ia(b,a)};Y.a.c.google=function(a,b){return new Ga(b,a)};var Z={load:p(Y.load,Y)}; true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return Z}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"!==typeof module&&module.exports?module.exports=Z:(window.WebFont=Z,window.WebFontConfig&&Y.load(window.WebFontConfig));}());


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./index.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./index.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "/* http://meyerweb.com/eric/tools/css/reset/\n   v2.0 | 20110126\n   License: none (public domain)\n*/\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed,\nfigure, figcaption, footer, header, hgroup,\nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  vertical-align: baseline; }\n\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure,\nfooter, header, hgroup, menu, nav, section {\n  display: block; }\n\nbody {\n  line-height: 1; }\n\nol, ul {\n  list-style: none; }\n\nblockquote, q {\n  quotes: none; }\n\nblockquote:before, blockquote:after,\nq:before, q:after {\n  content: '';\n  content: none; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\n/* Layout */\nhtml, body {\n  margin: 0;\n  padding: 0;\n  height: 100%; }\n\n.page {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  min-width: 960px;\n  color: #333;\n  font-family: 'PT Serif', serif;\n  font-size: 16px;\n  font-weight: 400;\n  line-height: 1.6; }\n\n.page__header,\n.page__footer {\n  flex-shrink: 0; }\n\n.page__content {\n  flex: 1 0 auto; }\n\n.page__container {\n  margin: 0 auto;\n  width: 960px; }\n\n/* Base design */\n.page__header,\n.page__footer {\n  padding: 20px 0;\n  background: #000;\n  color: #fff; }\n\n.menu {\n  margin-bottom: 40px;\n  padding: 10px 0;\n  height: 50px;\n  border-bottom: 1px solid #ccc;\n  box-sizing: border-box; }\n\n.side-block {\n  clear: both;\n  padding: 10px;\n  min-height: 100px;\n  border: 1px solid; }\n  .side-block._left {\n    float: left;\n    margin: 0 10px 10px 0; }\n  .side-block._right {\n    float: right;\n    margin: 0 0 10px 10px; }\n\nh1 {\n  margin-bottom: 20px;\n  font-family: \"Merriweather\", sans-serif;\n  font-size: 36px;\n  font-weight: 600; }\n\np {\n  margin: 15px 0; }\n\n.bottom-block {\n  display: block;\n  margin-bottom: 15px;\n  padding: 10px;\n  min-height: 50px;\n  border: 1px solid; }\n\n#bottom-block-2 {\n  height: 100px; }\n\n.row {\n  display: flex;\n  flex-direction: row; }\n  .row__col {\n    position: relative;\n    flex-basis: 50%;\n    box-sizing: border-box; }\n    .row__col:nth-child(2n) {\n      padding-left: 20px; }\n\n/* Debug styles */\n._fixed {\n  background-color: rgba(255, 255, 0, 0.5); }\n\n.fixer-placeholder {\n  background: rgba(255, 0, 0, 0.5); }\n", ""]);

	// exports


/***/ },
/* 11 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ])
});
;