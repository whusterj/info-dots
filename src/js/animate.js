import IdElement from './id-element';

let Animate = {
  css: css
};

export default Animate;

//

function css (element, animClass, callback) {
  element.classList.add(animClass);
  setTimeout(function () {
    element.classList.remove(animClass);
    callback();
  }, IdElement.animationDuration(element) * 1000);
}
  
// TODO: Implement an `enter` method similar to AngularJS's
// TODO: Implement a `leave` method similar to AngularJS's
