import Fixer from '../src/fixer';

let fixer = new Fixer();

fixer.addElement('.menu');

fixer.addElement('#side-block-1', {
  limiter: '#side-block-2'
});

fixer.addElement('#side-block-2', {
  limiter: '.bottom-block'
});

fixer.addElement('#bottom-block-1', {
  position: 'bottom'
});

fixer.addElement('#bottom-block-2', {
  position: 'bottom'
});