import {defineElement, calculateStyles, calculateOffset} from './utils';
import defaults from './defaults';

export default class Element {

  constructor (selector, options) {
    Object.assign(this, defaults, options);
    
    this.fixed = false;
    
    // define element and limiters
    this.node = defineElement(selector);
    this.limiter = defineElement(this.limiter);

    if (this.node && this.node.tagName) {

      // saving styles of element
      this.styles = calculateStyles(this.node);

      // saving top and left offsets of element
      this.offset = calculateOffset(this.node, this.styles);

      // saving element height
      this.height = this.node.offsetHeight;

      // creating placeholder if needed
      this.placeholder ? this.placeholder = this.createPlaceholder() : null;
    }
  }

  createPlaceholder () {
    var placeholder = document.createElement('span');

    placeholder.className = this.placeholderClass;
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

    delete this.placeholderClass;

    return placeholder;
  }

  fix (offset) {
    var element = this.node;
    var placeholder = this.placeholder;

    element.style.width = this.styles.width;  // set width before change position
    element.style.position = 'fixed';
    element.style[this.position] = offset + 'px';
    element.style.zIndex = this.styles.zIndex == 'auto' ? '100' : this.styles.zIndex;

    if (document.documentElement.classList && !element.classList.contains(this.fixedClass)) {
      element.classList.add(this.fixedClass);
    }
    else if (element.className.indexOf(this.fixedClass) == -1) {
      element.className += ' ' + this.fixedClass;
    }

    if (this.styles.float !== 'none') {
      element.style.left = this.offset.left - parseInt(this.styles.marginLeft) + 'px';
    }

    if (this.centering) {
      element.style.left = 0;
      element.style.right = 0;
    }

    if (placeholder) {
      placeholder.style.display = this.styles.display;
    }

    this.fixed = true;
  }

  unFix () {
    var element = this.node;
    var placeholder = this.placeholder;

    element.style.width = '';  // set width before change position
    element.style.position = this.styles.position;
    element.style.top = this.styles.top;
    element.style.zIndex = this.styles.zIndex;
    element.style.marginTop = this.styles.marginTop;

    if (document.documentElement.classList) {
      element.classList.remove(this.fixedClass)
    } else {
      element.className = element.className.replace(this.fixedClass, '');
    }

    if (placeholder) {
      placeholder.style.display = 'none';
    }

    this.fixed = false;
  };

  hide () {
    this.node.style.display = 'none';
  }

  show () {
    this.node.style.display = this.styles.display;
  }
}