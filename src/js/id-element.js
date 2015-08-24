/**
 * Library of common DOM Element operations
 */
let IdElement = {
  outerWidth: outerWidth,
  outerHeight: outerHeight,
  animationDuration: animationDuration,
};

export default IdElement;

//

function outerWidth (element) {
  /** Get the width of an element including margins */
  var elemCSS = window.getComputedStyle(element);
  return element.offsetWidth
    + (parseFloat(elemCSS.marginLeft, 10) || 0)
    + (parseFloat(elemCSS.marginRight, 10) || 0);
}

function outerHeight (element) {
  /** Get the height of an element including margins */
  var elemCSS = window.getComputedStyle(element);
  return element.offsetHeight 
    + (parseFloat(elemCSS.marginTop, 10) || 0)
    + (parseFloat(elemCSS.marginBottom, 10) || 0);      
}

function animationDuration (element) {
  /* Get the computed animation duration on the element */
  var elementCSS = window.getComputedStyle(element);
  return parseFloat(elementCSS['animation-duration'], 10);
}
