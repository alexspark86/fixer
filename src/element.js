import {defineElement, calculateStyles, calculateOffset} from './utils';

/**
 * @typedef {Object} defaults
 * @property {String} position Screen side to fix an element ('top'|'bottom'|'top bottom')
 * @property {Boolean} placeholder Indicates whether placeholder is needed
 * @property {String} placeholderClass Classname to generate the placeholder
 * @property {String} fixedClass Classname to add for a fixed element
 * @property {HTMLElement|String|Function} limiter Selector or node of the limiter for an element
 */
const DEFAULTS = {
  position: 'top',
  placeholder: true,
  placeholderClass: 'fixer-placeholder',
  fixedClass: '_fixed',
  limiter: null
};

/**
 * Class representing an element.
 * 
 * @class
 * @property {defaults} options Custom options for an element, extends DEFAULTS with initial options
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
   * @param {defaults} options
   */
  constructor (selector, options) {
    Object.assign(this.options = {}, DEFAULTS, options);
    
    Object.assign(this, {
      node: defineElement(selector),
      limiter: defineElement(this.options.limiter),
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
    var placeholder = document.createElement('span');

    placeholder.className = this.options.placeholderClass;
    placeholder.style.width = this.node.offsetWidth + 'px';
    placeholder.style.height = this.node.offsetHeight + 'px';
    placeholder.style.maxWidth = this.styles.maxWidth;
    placeholder.style.marginTop = this.styles.marginTop;
    placeholder.style.marginRight = this.styles.marginRight;
    placeholder.style.marginBottom = this.styles.marginBottom;
    placeholder.style.marginLeft = this.styles.marginLeft;
    placeholder.style.float = this.styles.float;
    placeholder.style.clear = this.styles.clear;
    placeholder.style.zIndex = '-1'; // for buggy Safari
    placeholder.style.display = 'none';

    this.node.parentNode.insertBefore(placeholder, this.node.nextSibling);

    return placeholder;
  }

  /**
   * Fix an element's node.
   * @param {number} offset
   */
  fix (offset) {
    let {node: element, placeholder} = this;

    Object.assign(element.style, {
      position: 'fixed',
      [this.position]: offset + 'px',
      zIndex: this.styles.zIndex == 'auto' ? '100' : this.styles.zIndex,
      width: this.styles.width
    });

    if (document.documentElement.classList && !element.classList.contains(this.options.fixedClass)) {
      element.classList.add(this.options.fixedClass);
    }
    else if (element.className.indexOf(this.options.fixedClass) == -1) {
      element.className += ' ' + this.options.fixedClass;
    }

    if (this.styles.float !== 'none') {
      element.style.left = this.offset.left - parseInt(this.styles.marginLeft) + 'px';
    }

    if (placeholder) {
      placeholder.style.display = this.styles.display;
    }

    this.fixed = true;
  }

  /**
   * Unfix an element's node (return its state to initial) and update properties.
   */
  unFix () {
    let {node: element, placeholder} = this;

    Object.assign(element.style, {
      position: this.styles.position,
      [this.position]: this.styles[this.position],
      zIndex: this.styles.zIndex,
      marginTop: this.styles.marginTop,
      width: ''
    });

    if (document.documentElement.classList) {
      element.classList.remove(this.options.fixedClass)
    } else {
      element.className = element.className.replace(this.options.fixedClass, '');
    }

    if (placeholder) {
      placeholder.style.display = 'none';
    }

    this.fixed = false;
  };

  /**
   * Hide node of an element.
   */
  hide () {
    this.node.style.display = 'none';
  }

  /**
   * Show node of an element (return its initial display style).
   */
  show () {
    this.node.style.display = this.styles.display;
  }
}