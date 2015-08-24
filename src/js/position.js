import IdElement from './id-element';

let Position = {
  above: above,
  below: below,
  centerOffset: centerOffset
};

export default Position;

//

function above (parent, child) {
  /* Get child position that centers it above parent */
}

function below (parent, child) {
  /* Get child position that centers it below parent */
  
  var childLeft = centerOffset(parent).left - (IdElement.outerWidth(child) / 2);
  var childTop = parent.offsetTop + parent.offsetHeight;

  // Align the child element to the left side of the screen
  // in edge cases where it would overflow the left side
  // or where the screen is skinnier than the child element.
  if (childLeft < 0 || window.innerWidth <= IdElement.outerWidth(child)) {
    childLeft = 0;
  } else if (childLeft + IdElement.outerWidth(child) > window.innerWidth) {
    // Ensure the popover doesn't overflow the right side of the screen.
    childLeft = window.innerWidth - IdElement.outerWidth(child);
  }

  return {
    top: childTop,
    left: childLeft,
  };
  
}

function centerOffset (element) {
  /* Get the left offset (in pixels) of the center of an element */
  return {
    left: element.offsetLeft + element.offsetWidth / 2,
    top: element.offsetTop + element.offsetHeight / 2,
 };
}