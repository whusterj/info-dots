/**
 * Library of common utility functions
 */
export var curry = curry;
export var invoke = curry(invoke);
export var debounce = debounce;

function curry(fn, n) {
  // If `n` argument was omitted, use the function .length property.
  if (typeof n !== 'number') {
    n = fn.length;
  }

  function getCurriedFn(prev) {
    return function(arg) {
      // Concat the just-specified argument with the array of
      // previously-specified arguments.
      var args = prev.concat(arg);
      if (args.length < n) {
        // Not all arguments have been satisfied yet, so return a curried
        // version of the original function.
        return getCurriedFn(args);
      } else {
        // Otherwise, invoke the original function with the arguments and
        // return its value.
        return fn.apply(this, args);
      }
    };
  }

  // Return a curried version of the original function.
  return getCurriedFn([]);
}
 
// Invoke a method on an object - this allows us to map
// over lists of objects, running the method on each.
function invoke (method, item) {
  item[method]();
}

// Debounce function from David Walsh's blog
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
