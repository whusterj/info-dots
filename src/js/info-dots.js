import Animate from './animate';
import Popover from './popover';
import Position from './position';
import { invoke, debounce } from './utils';

// Bind to global (same as `window`) so that our component can be
// used in inline scripts, if that's what people are into.
global.InfoDots = InfoDots;
global.InfoDot = InfoDot;

export default InfoDots;
export var InfoDot = InfoDot;

function helloWorld () {
  console.log('Hello World');
}

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
    this.dots.map(invoke('render'));
  }
  
  // Hide dots while the browser resizes and then
  // re-render dots after the browser has been resized,
  // in case their target elements have been reflowed.
  window.addEventListener('resize', debounce(function () {
    this.dots.map(invoke('hide'));
  }.bind(this), 250, true));
  window.addEventListener('resize', debounce(function () {
    this.dots.map(invoke('render'));
    this.dots.map(invoke('show'));
  }.bind(this), 250));
}

InfoDots.prototype.refresh = function () {
  this.dots.map(invoke('render'));
}