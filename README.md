# Fixer
Fixer helps you to easily fix elements in stacks on a page without using jQuery. 

## Notice ##
The plugin is currently in development. Be careful to use it in production.

## Usage ##

The basic Fixer design pattern is one instance of plugin, which has one or more elements added to it. Each element may have its settings for fixing on the page. By default, all elements are fixed to the top of the screen one after the other.

Default options: 

```js
var fixer = new Fixer();
fixer.addElement(".menu");
```

Fixing multiple elements:

```js
var fixer = new Fixer();

fixer
  .addElement(".menu")
  .addElement(".toc");
```

Position option:

```js
var fixer = new Fixer();

fixer.addElement(".bottom-block", {
  position: "bottom"
});
```

Setting a limit for a fixed element - when reaching the limit the element will scroll up with page:

```js
var fixer = new Fixer();

fixer
  .addElement(".menu", {
    limit: "#limit-block-1"
  })
  .addElement(".toc", {
    limit: function () {
      var limitBlock = document.getElementById("limit-block-2");
      var limitOffset = limitBlock.getBoundingClientRect().top + document.documentElement.scrollTop;
  
      return limitOffset;
    }
  });
```

Using a custom class-name for a fixed element and for its placeholder:

```js
var fixer = new Fixer();

fixer.addElement(".menu", {
  fixedClass: "my-fixed-classname",
  placeholderClass: "my-placeholder-classname"
});
```

## Copyright and license

Code released under [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.txt).