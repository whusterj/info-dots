# VanillaJS Info Dots!

Info Dots are UI Components you can use to annotate bits of your web site or web app interface. They appear as small, pulsing anchors that you can attach to practically any DOM Element.

## Just Declare It

I'm a huge fan of UI components that can be declared in HTML with minimal configuration in JavaScript. I'm especially fanatical about the structure of the required HTML mark-up.

**Component mark-up should be simple.** It should easy to learn how to use a component. The mark-up should also be "semantic." That is, it should explain itself, so that it's hard to forget how it works. And so these are a few of the goals of this component.

### Example

The element you want to annotate does not need to know about the Info Dot that will be attached to it. All you have to do is to set an `id` attribute on the element you want to target, so that our Info Dot can find it.

```
<!-- Include the script -->
<script src="info-dots.js"></script>

<!-- Here's the element we want to annotate -->
<div id="importantText"><p>This is important</p></div>

<!-- Place this Info Dot mark-up anywhere else... -->
<!-- Just make sure to set the `data-target` -->
<div data-info-dot data-target="importantText"
     data-message="Here's something informative for ye.">
</div>

<!-- Initialize the plugin -->
<script>InfoDots.init();</script>
```

Browser Support (probably)

Info Dots has been thoroughly tested in Chrome for Desktop, but not so much other browsers. These browsers will most likely support it, though:

 - IE 10+
 - Firefox 4+
 - Safari

**Info Dots is HTML5-first.** While I am very interested in making this component compliant with modern web standards, I have no interest in hacking it up to provide support for older browsers. If your needs differ, you are of course welcome to fork this code and perform whatever unholy rituals upon it.