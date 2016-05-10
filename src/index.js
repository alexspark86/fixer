import Fixer from '../src/fixer';

let fixer = new Fixer();

fixer
  .addElement('.menu')
  .addElement('#side-block-1', {
    limiter: '#side-block-2'
  })
    .addElement('#side-block-2', {
    limiter: '.bottom-block'
  })
  .addElement('#bottom-block-1', {
    position: 'bottom'
  })
  .addElement('#bottom-block-2', {
    position: 'bottom'
  });