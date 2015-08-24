import Animate from './animate';
import Position from './position';

export default function Popover (options) {
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
};

Popover.prototype.updatePosition = function (position) {
  if (position) this.position = position;
  this.element.style.top = this.position.top + 'px';
  this.element.style.left = this.position.left + 'px';
};
