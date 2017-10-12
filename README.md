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


## Copyright and license

Code released under [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.txt).
