/**
 * Code for the Info Dots demo page
 */
import InfoDots from './info-dots';

// Calling code to set up InfoDots
document.addEventListener("DOMContentLoaded", function() {
  // `InfoDots.init()` sets up InfoDots for all DOM Elements with 'data-info-dot' attribute.
  // TODO: We have a race condition with highlightJS's DOM manipulation.
  //       We have to wait until it's done working, or the InfoDot
  //       will not have the correct offset. This will also be a problem
  //       with other plug-ins that affect the size / flow of InfoDot targets.
  setTimeout(InfoDots.init, 1000);
});