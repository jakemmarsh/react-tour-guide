react-tour-guide [![npm version](https://badge.fury.io/js/react-tour-guide.svg)](http://badge.fury.io/js/react-tour-guide)
==========================================================================================================================

A ReactJS mixin to give new users a popup-based tour of your application.

---

### Getting Started

1. `npm install --save react-tour-guide`
2. `var TourGuideMixin = require('react-tour-guide').Mixin`

```javascript
var TourGuideMixin = require('react-tour-guide').Mixin;
var tour = {
  pointSize: 30,
  steps: [
    {
      text: 'This is the first step in the tour.',
      element: 'header',
      position: 'bottom'
    },
    {
      text: 'This is the second step in the tour.',
      element: '.navigation',
      position: 'right'
    }
  ]
};
var cb = function() {
  console.log('User has completed tour!');
};

var App = React.createClass({

  mixins: [TourGuideMixin(tour, cb)],

  ...

});
```

---

### Options

A Javascript object is passed to the TourGuideMixin to specify options, as well as the steps of your tour as an array. The options are:

- `pointSize` (int): the size (in pixels) that you want the Indicator to be. Defaults to `30`.

Each "step" in the array represents one indicator and tooltip that a user must click through in the guided tour. A step has the following structure:

```json
{
  "text": "The helpful tip or information the user should read at this step.",
  "element": "A jQuery selector for the element which the step relates to.",
  "position": "Where to position the indicator in relation to the element."
}
```

Positions can be chosen from: `top-left`, `top-right`, `right`, `bottom-right`, `bottom`, `bottom-left`, `left`, and `center`. This defaults to `center`.

---

### Completion Callback

An optional callback may be passed as the second parameter to `TourGuideMixin`, which will be called once the current user has completed all the steps of your tour.

---

### Styling

Some basic styling is provided in `/lib/styles/tour-guide.css`. This can either be included directly in your project, or used as a base for your own custom styles. Below, the HTML structure of the tour is also outlined for custom styling.

The guided tour consists of two main elements for each step: an `indicator` and a `tooltip`. An indicator is a flashing element positioned on a specific element on the page, cueing the user to click. Upon click, the associated tooltip is triggered which the user must then read and dismiss.

##### Indicator

```html
<div class="tour-indicator"></div>
```

##### Tooltip

```html
<div class="tour-backdrop">
  <div class="tour-tooltip">
    <p>{The step's text goes here.}</p>
    <div class="tour-btn close">Close</div>
  </div>
</div>
```