/**
 * @jsx React.DOM
 */
'use strict';

var React     = require('react/addons');
var $         = require('jquery');

var Indicator = require('./Indicator');
var Tooltip   = require('./Tooltip');

module.exports = function(settings, done) {

  var mixin = {

    settings: $.extend({
      pointSize: 30,
      steps: []
    }, settings),

    completionCallback: done || function() {},

    getInitialState: function() {
      return {
        currentIndex: 0,
        showTooltip: false
      };
    },

    _renderLayer: function() {
      // By calling this method in componentDidMount() and componentDidUpdate(), you're effectively
      // creating a "wormhole" that funnels React's hierarchical updates through to a DOM node on an
      // entirely different part of the page.
      React.render(this.renderCurrentStep(), this._target);
    },

    _unrenderLayer: function() {
      React.unmountComponentAtNode(this._target);
    },

    componentDidUpdate: function() {
      if ( this.settings.steps[this.state.currentIndex] ) {
        this._renderLayer();
      } else {
        this.completionCallback();
        this._unrenderLayer();
      }
    },

    componentDidMount: function() {
      // Appending to the body is easier than managing the z-index of everything on the page.
      // It's also better for accessibility and makes stacking a snap (since components will stack
      // in mount order).
      if ( this.settings.steps[this.state.currentIndex] ) {
        this._target = document.createElement('div');
        document.body.appendChild(this._target);
        this._renderLayer();
      }
    },

    componentWillUnmount: function() {
      this._unrenderLayer();
      document.body.removeChild(this._target);
    },

    preventWindowOverflow: function(value, axis) {
      var winWidth = parseInt($(window).width());

      if ( axis.toLowerCase() === 'x' ) {
        if ( value > winWidth ) {
          value = winWidth - this.settings.pointSize;
        } else if ( value < 0 ) {
          value = 0;
        }
      } else if ( axis.toLowerCase() === 'y' && value < 0 ) {
        value = 0;
      }

      return value;
    },

    calculatePlacement: function(step) {
      var $element = $(step.element);
      var offset = $element.offset();
      var width = $element.width();
      var height = $element.height();
      var position = step.position.toLowerCase();
      var placement = {
        x: 0,
        y: 0
      };

      switch ( position ) {
        case 'top-left':
          placement.x = offset.left;
          placement.y = offset.top;
          break;
        case 'top':
          placement.x = offset.left + width/2 - this.settings.pointSize/2;
          placement.y = offset.top;
          break;
        case 'top-right':
          placement.x = offset.left + width - this.settings.pointSize;
          placement.y = offset.top;
          break;
        case 'right':
          placement.x = offset.left + width - this.settings.pointSize;
          placement.y = offset.top + height/2 - this.settings.pointSize/2;
          break;
        case 'bottom-right':
          placement.x = offset.left + width - this.settings.pointSize;
          placement.y = offset.top + height - this.settings.pointSize;
          break;
        case 'bottom':
          placement.x = offset.left + width/2 - this.settings.pointSize/2;
          break;
        case 'bottom-left':
          placement.x = offset.left;
          placement.y = offset.top + height - this.settings.pointSize;
          break;
        case 'left':
          placement.x = offset.left;
          placement.y = offset.top + height/2 - this.settings.pointSize/2;
          break;
        default: // center
          placement.x = offset.left + width/2 - this.settings.pointSize/2;
          placement.y = offset.top + height/2 - this.settings.pointSize/2;
      }

      return {
        indicator: {
          x: this.preventWindowOverflow(placement.x, 'x'),
          y: this.preventWindowOverflow(placement.y, 'y')
        },
        tooltip: {
          x: this.preventWindowOverflow(placement.x, 'x'),
          y: this.preventWindowOverflow(placement.y, 'y')
        }
      };
    },

    handleIndicatorClick: function(evt) {
      evt.preventDefault();

      this.setState({ showTooltip: true });
    },

    closeTooltip: function(evt) {
      evt.preventDefault();

      this.setState({
        showTooltip: false,
        currentIndex: this.state.currentIndex + 1
      });
    },

    renderCurrentStep: function() {
      var element = null;
      var currentStep = this.settings.steps[this.state.currentIndex];
      var placement = this.calculatePlacement(currentStep);

      if ( this.state.showTooltip ) {
        element = (
          <Tooltip xPos={placement.tooltip.x}
                   yPos={placement.tooltip.y}
                   text={currentStep.text}
                   closeTooltip={this.closeTooltip} />
        );
      } else {
        element = (
          <Indicator xPos={placement.indicator.x}
                     yPos={placement.indicator.y}
                     handleIndicatorClick={this.handleIndicatorClick} />
        );
      }

      return element;
    }

  };

  return mixin;

};