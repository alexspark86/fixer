import Fixer from '../src/fixer';

let fixer = new Fixer();

fixer.addElement({
  element: '.menu',
  limiter: '.footer'
});

fixer.addElement({
  element: '#side-block-1',
  limiter: '#side-block-2'
});

fixer.addElement({
  element: '#side-block-2',
  limiter: '.bottom-block'
});

fixer.addElement({
  element: '#bottom-block-1',
  position: 'bottom'
});

fixer.addElement({
  element: '#bottom-block-2',
  position: 'bottom'
});