/**
 * Defines some common helper functions
 */

export var render = render;
export var show = show;
export var hide = hide;

// Utilities
function render (item) {
  item.render();
}

function show (item) {
  item.show();
}

function hide (item) {
  item.hide();
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

// Library of common DOM Element operations
var IdElement = (function () {
  
  var exports = {
    outerWidth: outerWidth,
    outerHeight: outerHeight,
    animationDuration: animationDuration,
  };
  
  return exports;
  
  ///
  
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
  
})();

//
var Position = (function () {

  var exports = {
    above: above,
    below: below,
    centerOffset: centerOffset,
  };
  
  return exports;
  
  ///

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

})();

//
var Animate = (function () {
  
  var exports = {
    css: css,
  };
  
  return exports;
  
  ///
  
  function css (element, animClass, callback) {
    element.classList.add(animClass);
    setTimeout(function () {
      element.classList.remove(animClass);
      callback();
    }, IdElement.animationDuration(element) * 1000);
  }
  
  // TODO: Implement an `enter` method similar to AngularJS's
  // TODO: Implement a `leave` method similar to AngularJS's
  
})();

// Depends on `Animate` and `IdElement`
function Popover (options) {
  this.parent = options.parent || null;
  this.position = options.position || {
    top: 0,
    left: 0,
  };
  this.message = options.message || 'A popover message!';
  this.element = options.element || document.createElement('div');
  this.element.classList.add('popover');
  this.element.innerHTML = '<p>' + this.message + '</p>';
  this.showing = false;
  this.animating = false;
}

Popover.create = function (options) {
  return new Popover(options);
};

Popover.prototype.show = function () {
  if (this.showing || this.animating) return;

  this.parent.parentNode.insertBefore(this.element, this.parent.nextSibling);
  this.updatePosition(Position.below(this.parent, this.element));

  this.animating = true;
  Animate.css(this.element, 'fade-in-up', function () {
    this.showing = true;
    this.animating = false;
  }.bind(this));
};

Popover.prototype.hide = function  () {
  if (!this.showing || this.animating) return;

  this.animating = true;
  Animate.css(this.element, 'fade-out-down', function () {
    this.element.parentNode.removeChild(this.element);
    this.animating = false;
    this.showing = false;
  }.bind(this));
};

Popover.prototype.toggle = function () {
  if (this.showing) {
    this.hide();
  } else {
    this.show();
  }
}

Popover.prototype.updatePosition = function (position) {
  if (position) this.position = position;
  this.element.style.top = this.position.top + 'px';
  this.element.style.left = this.position.left + 'px';
};

// Depends on `Popover` and `Animate`
function InfoDot (options) {
  this.position = options.position || {
    top: 0,
    left: 0,
  };
  this.showing = true;
  this.enableHover = typeof(options.enableHover) === 'undefined' ? true : options.enableHover;
  this.popover = options.popover || null;
  this.element = options.element || null;
  this.parentElement = options.parentElement || document.body;
}

InfoDot.create = function (options) {
  return new InfoDot(options);
}

InfoDot.prototype.render = function () {
  this.makeElement();
  this.alignToTarget();
  Animate.css(this.element, 'fade-in', function () {
    this.element.classList.add('pulse');
  }.bind(this));
  this.attachPopover();
};

InfoDot.prototype.makeElement = function () {
  if (!this.element) {
    this.element = document.createElement('div');
  }
  this.element.classList.add('info-dot');
  this.parentElement.appendChild(this.element);
};

InfoDot.prototype.updatePosition = function (position) {
  if (position) { this.position = position; }
  this.element.style.top = this.position.top + 'px';
  this.element.style.left = this.position.left + 'px';
};

InfoDot.prototype.attachPopover = function () {
  if (!this.popover) {
    this.popover = Popover.create({
      parent: this.element,
      message: this.element.getAttribute('data-message'),
    });
  }
  this.attachClickListener();
  if (this.enableHover) this.attachHoverListeners();
}

InfoDot.prototype.attachHoverListeners = function () {
  this.element.addEventListener('mouseenter', function () {
    this.popover.show();
  }.bind(this));
  this.element.addEventListener('mouseleave', function () {
    this.popover.hide();
  }.bind(this));
  
  // 
  document.addEventListener('mousemove', debounce(function (event) {
    if (!this.element.contains(event.target) && !this.popover.element.contains(event.target)) {
      if (this.popover.showing) { this.popover.hide(); }
    }
  }.bind(this), 150, true));
}

InfoDot.prototype.attachClickListener = function () {
  this.element.addEventListener('click', function () {
    this.popover.toggle();
  }.bind(this));
}

InfoDot.prototype.alignToTarget = function () {
  this.updatePosition(this.getTargetCenter());
}

InfoDot.prototype.getTargetCenter = function () {
  var targetElem = this.getTargetElem();
  return Position.centerOffset(targetElem);
}

InfoDot.prototype.getTargetElem = function () {
  var targetElemId = this.element.getAttribute('data-target');
  return document.getElementById(targetElemId);
}

InfoDot.prototype.hide = function () {
  this.element.style.display = 'none';
  this.showing = false;
}

InfoDot.prototype.show = function () {
  this.element.style.display = 'block';
  this.showing = true;
}

// Bootstrap and manage a collection of InfoDots
function InfoDots (options) {
  this.dots = [];
}

InfoDots.init = function (options) {
  var newInfoDots = new InfoDots(options);
  newInfoDots.link();
  return newInfoDots;
}

InfoDots.prototype.link = function () {
  var infoDotElems = document.querySelectorAll('[data-info-dot]');
  for (var i = 0; i < infoDotElems.length; ++i) {
    var infoDotElem = infoDotElems[i];
    var newDot = InfoDot.create({element: infoDotElem,});
    this.dots.push(newDot);
    this.dots.map(render);
  }
  
  // Hide dots while the browser resizes and then
  // re-render dots after the browser has been resized,
  // in case their target elements have been reflowed.
  window.addEventListener('resize', debounce(function () {
    this.dots.map(hide);
  }.bind(this), 250, true));
  window.addEventListener('resize', debounce(function () {
    this.dots.map(render);
    this.dots.map(show);
  }.bind(this), 250));
}

InfoDots.prototype.refresh = function () {
  this.dots.map(render);
}

// Calling code!

// Kick off HighlightJS
hljs.initHighlightingOnLoad();

// Init InfoDots
document.addEventListener("DOMContentLoaded", function() {
  // `InfoDots.init()` sets up InfoDots for all DOM Elements with 'data-info-dot' attribute.
  // TODO: We have a race condition with highlightJS's DOM manipulation.
  //       We have to wait until it's done working, or the InfoDot
  //       will not have the correct offset. This will also be a problem
  //       with other plug-ins that affect the size / flow of InfoDot targets.
  setTimeout(InfoDots.init, 1000);
});