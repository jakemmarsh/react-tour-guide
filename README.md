react-tour-guide
=================

A ReactJS mixin to give new users a popup-based tour of your application.

---

### Getting Started

1. `npm install --save react-tour-guide`
2. `var TourGuideMixin = require('react-tour-guide').Mixin`

```
var TourGuideMixin = require('react-tour-guide').Mixin;
var tour = [

];

var InnerApp = React.createClass({

  mixins: [TourGuideMixin(tour)],

  ...

});
```

---

### Options

An `array` of "steps" is passed to the TourGuideMixin. Each "step" represents one indicator and tooltip that a user must click through in the guided tour. A step has the following structure:

```
{
  'text': 'The helpful tip or information the user should read at this step.',
  'element': 'A jQuery selector for the element which the step relates to.'
  'position': 'Where to position the indicator in relation to the element.'
}
```

Positions can be chosen from: `top-left`, `top-right`, `right`, `bottom-right`, `bottom`, `bottom-left`, `left`, and `center`. This defaults to `center`.

---

### HTML Structure

The guided tour consists of two main elements for each step: an `indicator` and a `tooltip`. An indicator is a flashing element positioned on a specific element on the page, cueing the user to click. Upon click, the associated tooltip is triggered which the user must then read and dismiss.

##### Indicator

```
<div />
```

##### Tooltip

```
<div />
```