# Fixer
Easily fix elements in stacks on page scroll without using jQuery.

### Demo
Here is a working live demo: http://alexspark86.github.io/fixer

### Features
* stick element to the top or the bottom of the screen when it reaches the corresponding side of the viewport
* stick multiple elements in sequences (one after one)
* specify limiters, upon reaching which sticky element will go beyond the edge of the screen
* predict height of sticky elements before `scroll` event (useful if you need to accurately scroll to some block)

### Simple example
```js
import Fixer from 'fixer-js';

const fixer = new Fixer();
fixer.addElement('.header');
```

### Influences

Fixer is inspired by [ScrollToFixed](https://github.com/bigspotteddog/ScrollToFixed), but doesn't use jQuery, has a simpler interface and more advanced features.

## Installation
Install with [npm](https://www.npmjs.com/):
```sh
npm install fixer-js
```

Install with [yarn](https://yarnpkg.com/):
```sh
yarn add fixer-js
```

## Usage

The basic Fixer design pattern is one instance of plugin, which has one or more elements added to it. Each element may have its settings for fixing on the page. By default, all elements are fixed to the top of the screen one after another.

All examples assume that plugin is bootstrapped using:

```js
import Fixer from 'fixer-js';
```


Basic usage: 

```js
const fixer = new Fixer();

fixer.addElement('.menu');
```

Fixing multiple elements:

```js
const fixer = new Fixer();

fixer
  .addElement('.menu')
  .addElement('.toc');
```

Position option:

```js
const fixer = new Fixer();

fixer.addElement('.bottom-block', {
  position: 'bottom'
});
```

Setting a limit for a fixed element - when reaching the limit the element will scroll up with page:

```js
const fixer = new Fixer();

fixer
  .addElement('.menu', {
    limit: '#limit-block-1'
  })
  .addElement('.toc', {
    limit: function () {
      const limitBlock = document.getElementById('limit-block-2');
      return limitBlock.getBoundingClientRect().top + document.documentElement.scrollTop;
    }
  });
```

Using a custom class-name for a fixed element and for its placeholder:

```js
const fixer = new Fixer();

fixer.addElement('.menu', {
  fixedClass: 'my-fixed-classname',
  placeholderClass: 'my-placeholder-classname'
});
```

Removing element from Fixer:

```js
const fixer = new Fixer();

fixer.addElement('.menu');
fixer.removeElement('.menu');
```
<br/>

## API

### addElement(selector, [options])
Add an element to Fixer.  

| Param | Type |
| --- | --- |
| selector | `String` or `HTMLElement` or `jQuery` | 
| [options](#add-element-options) | `Object` |

### removeElement(selector)
Remove an element from Fixer.

| Param | Type |
| --- | --- |
| selector | `String` or `HTMLElement` or `jQuery` | 

### resetElements()
Reset all elements position and calculated values.

### getHeight([position], [offset])
Getting height of the fixed element.

There are two options for using:
* Get current fixed height if the arguments did not assign;
* Get height of elements that will fixed on the provided offset. It useful for scrolling to anchor.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [position] | `String` | `top` | Side of the screen where elements should be fixed |
| [offset] | `Number`<br/>`Function`<br/> | `window.pageYOffset` | Offset value relative to the document for which to calculate the height of the fixed elements |

#### Examples of getting height
Get height of all fixed elements:
```js
const heightOfElementsFixedOnTop = fixer.getHeight();
const heightOfElementFixedOnBottom = fixer.getHeight('bottom');
```

Predict height of fixed element before scroll to the `#some-block`:
```js
const predictedHeightOfFixedElements = fixer.getHeight(function() {
  const myBlock = document.querySelector('#some-block');
  return myBlock.getBoundingClientRect().top + window.pageYOffset;
});
```
<br/>

<a name="add-element-options"></a>
### Configuration options for adding element

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| **position** | `String` | `top` | Screen side to fix an element.<br/><br/>Available options: <ul><li>`top`</li><li>`bottom`</li></ul> |
| **limit** | `HTMLElement`<br/>`String`<br/>`Function` | `null` | Limit for an element, upon reaching which sticky element will go beyond the edge of the screen |
| **placeholder** | `Boolean` | `true` | Indicates whether placeholder is needed |
| **placeholderClass** | `String` | `fixer-placeholder` | Classname to generate the placeholder |
| **fixedClass** | `String` | `_fixed` | Classname to add for a fixed element |
| **setWidth** | `Boolean` | `true` | Indicates whether to automatically calculate the width of the element on fixing |
| **stack** | `Boolean` | `true` | Indicates whether the height of the element count for fixing other elements |
| **stretchTo** | `HTMLElement`<br/>`String`<br/>`Function` | `null` | **_Experimental feature:_** coordinate to stretch element vertically to it |
<br/>

## Copyright and license

Code released under [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.txt).
