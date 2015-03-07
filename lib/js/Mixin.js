/**
 * @jsx React.DOM
 */
'use strict';

var React     = require('react/addons');
var $         = require('jquery');

var Indicator = require('./Indicator');
var Tooltip   = require('./Tooltip');

window.jQuery = $;

module.exports = function(settings, done) {

  var mixin = {

    settings: $.extend({
      scrollToSteps: true,
      indicatorSize: 30,
      tooltipWidth: 250,
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

    preventWindowOverflow: function(type, value, axis) {
      var winWidth = parseInt($(window).width());
      var docHeight = parseInt($(document).height());
      var sizeVariable = type.toLowerCase() === 'indicator' ? this.settings.indicatorSize : this.settings.tooltipWidth;

      if ( axis.toLowerCase() === 'x' ) {
        if ( value + sizeVariable > winWidth ) {
          value = winWidth - sizeVariable;
        } else if ( value - sizeVariable/2 < 0 ) {
          value = 0;
        }
      } else if ( axis.toLowerCase() === 'y' ) {
        if ( value + sizeVariable/2 > docHeight ) {
          value = docHeight - sizeVariable;
        } else if ( value - sizeVariable/2 < 0 ) {
          value = 0;
        }
      }

      return value;
    },

    calculatePlacement: function(step, $element) {
      var offset = $element.offset();
      var width = $element.width();
      var height = $element.height();
      var position = step.position.toLowerCase();
      var topRegex = new RegExp('top', 'gi');
      var bottomRegex = new RegExp('bottom', 'gi');
      var leftRegex = new RegExp('left', 'gi');
      var rightRegex = new RegExp('right', 'gi');
      var placement = {
        indicator: {
          x: 0,
          y: 0
        },
        tooltip: {
          x: 0,
          y: 0
        }
      };

      // Calculate x positions
      if ( leftRegex.test(position) ) {
        placement.indicator.x = offset.left - this.settings.indicatorSize/2;
        placement.tooltip.y = offset.top - this.settings.tooltipWidth/4;
      } else if ( rightRegex.test(position) ) {
        placement.indicator.x = offset.left + width - this.settings.indicatorSize/2;
        placement.tooltip.x = offset.left + width - this.settings.tooltipWidth/2;
      } else {
        placement.indicator.x = offset.left + width/2 - this.settings.indicatorSize/2;
        placement.tooltip.x = offset.left + width/2 - this.settings.tooltipWidth/2;
      }

      // Calculate y positions
      if ( topRegex.test(position) ) {
        placement.indicator.y = offset.top - this.settings.indicatorSize/2;
        placement.tooltip.y = offset.top - this.settings.tooltipWidth/4;
      } else if ( bottomRegex.test(position) ) {
        placement.indicator.y = offset.top + height - this.settings.indicatorSize/2;
        placement.tooltip.y = offset.top + height - this.settings.tooltipWidth/4;
      } else {
        placement.indicator.y = offset.top + height/2 - this.settings.indicatorSize/2;
        placement.tooltip.y = offset.top + height/2 - this.settings.tooltipWidth/4;
      }

      return {
        indicator: {
          x: this.preventWindowOverflow('indicator', placement.indicator.x, 'x'),
          y: this.preventWindowOverflow('indicator', placement.indicator.y, 'y')
        },
        tooltip: {
          x: this.preventWindowOverflow('tooltip', placement.tooltip.x, 'x'),
          y: this.preventWindowOverflow('tooltip', placement.tooltip.y, 'y')
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
      }, this.scrollToNextStep);
    },

    scrollToNextStep: function() {
      var $nextIndicator = $('.tour-indicator');

      if ( $nextIndicator && $nextIndicator.length && this.settings.scrollToSteps ) {
        $('html, body').animate({
          'scrollTop': $nextIndicator.offset().top - $(window).height()/2
        }, 500);
      }
    },

    renderCurrentStep: function() {
      var element = null;
      var currentStep = this.settings.steps[this.state.currentIndex];
      var $target = $(currentStep.element);
      var cssPosition = $target.css('position');
      var placement = this.calculatePlacement(currentStep, $target);

      if ( this.state.showTooltip ) {
        element = (
          <Tooltip cssPosition={cssPosition}
                   xPos={placement.tooltip.x}
                   yPos={placement.tooltip.y}
                   width={this.settings.tooltipWidth}
                   text={currentStep.text}
                   closeTooltip={this.closeTooltip} />
        );
      } else {
        element = (
          <Indicator cssPosition={cssPosition}
                     xPos={placement.indicator.x}
                     yPos={placement.indicator.y}
                     size={this.settings.indicatorSize}
                     handleIndicatorClick={this.handleIndicatorClick} />
        );
      }

      return element;
    }

  };

  return mixin;

};