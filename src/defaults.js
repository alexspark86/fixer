/**
 * @typedef {Object} defaults
 * @property {string} position Screen side to fix an element ('top'|'bottom'|'top bottom')
 * @property {boolean} placeholder Indicates whether placeholder is needed
 * @property {string} placeholderClass Classname to generate the placeholder
 * @property {function} offset Custom function to calculate offset
 * @property {HTMLElement|string} limiterTop Selector of the top limiter for element fixation
 * @property {HTMLElement|string} limiterBottom Selector of the bottom limiter for element fixation
 */

let defaults = {
  position: 'top',
  placeholder: true,
  placeholderClass: 'fixer-placeholder',
  centering: false,
  offset: null,
  limiter: null
};

export default defaults;