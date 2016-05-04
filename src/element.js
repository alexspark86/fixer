import {defineElement, calculateStyles, calculateOffset} from './utils';
import defaults from './defaults';

export default class Element {

  constructor (options) {
    Object.assign(this, defaults, options);
    
    this.fixed = false;
    
    // define the element and limiters
    this.element = defineElement(this.element);
    this.limiter = defineElement(this.limiter);

    if (this.element && this.element.tagName) {

      // saving styles of the element
      this.styles = calculateStyles(this.element);

      // saving top and left offsets of the element
      this.offset = calculateOffset(this.element, this.styles);

      // saving element height
      this.height = this.element.offsetHeight;

      // creating placeholder if needed
      this.placeholder ? this.placeholder = this.createPlaceholder() : null;
    }
  }

  createPlaceholder () {
    var placeholder = document.createElement('div');

    placeholder.className = this.placeholderClass;
    placeholder.style.width = this.element.offsetWidth + 'px';
    placeholder.style.height = this.element.offsetHeight + 'px';
    placeholder.style.maxWidth = this.styles.maxWidth;
    placeholder.style.marginTop = this.styles.marginTop;
    placeholder.style.marginRight = this.styles.marginRight;
    placeholder.style.marginBottom = this.styles.marginBottom;
    placeholder.style.marginLeft = this.styles.marginLeft;
    placeholder.style.float = this.styles.float;
    placeholder.style.clear = this.styles.clear;
    placeholder.style.zIndex = '-1'; // for buggy Safari
    placeholder.style.display = 'none';

    this.element.parentNode.insertBefore(placeholder, this.element.nextSibling);

    delete this.placeholderClass;

    return placeholder;
  }

  fix (offset) {
    var element = this.element;
    var placeholder = this.placeholder;

    if (!this.fixed) {
      element.style.width = this.styles.width;  // set width before change position
      element.style.position = 'fixed';
      element.style.top = offset + 'px';
      element.style.zIndex = this.styles.zIndex == 'auto' ? '100' : this.styles.zIndex;
      element.className += ' _fixed';

      if (this.styles.float !== 'none') {
        element.style.left = this.offset.left - parseInt(this.styles.marginLeft) + 'px';
      }

      if (this.centering) {
        element.style.left = 0;
        element.style.right = 0;
      }

      if (placeholder) {
        placeholder.style.display = 'block';
      }

      this.fixed = true;
    }
  }

  unFix () {
    var element = this.element;
    var placeholder = this.placeholder;

    if (this.fixed) {
      element.style.width = '';  // set width before change position
      element.style.position = this.styles.position;
      element.style.top = this.styles.top;
      element.style.zIndex = this.styles.zIndex;
      element.style.marginTop = this.styles.marginTop;
      element.className = element.className.replace('_fixed', '');

      if (placeholder) {
        placeholder.style.display = 'none';
      }

      this.fixed = false;
    }
  };

  hide () {
    this.element.style.display = 'none';
  }

  show () {
    this.element.style.display = this.styles.display;
  }
}