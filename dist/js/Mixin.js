'use strict';

var React     = require('react/addons');
var $         = require('jquery');

var Indicator = require('./Indicator');
var Tooltip   = require('./Tooltip');

module.exports = function(settings, done) {

  var mixin = {

    settings: $.extend({
      startIndex: 0,
      scrollToSteps: true,
      steps: []
    }, settings),

    completionCallback: done || function() {},

    getInitialState: function() {
      return {
        currentIndex: this.settings.startIndex,
        showTooltip: false,
        indicatorXPos: -1000,
        indicatorYPos: -1000,
        tooltipXPos: -1000,
        tooltipYPos: -1000
      };
    },

    _renderLayer: function() {
      // By calling this method in componentDidMount() and componentDidUpdate(), you're effectively
      // creating a "wormhole" that funnels React's hierarchical updates through to a DOM node on an
      // entirely different part of the page.
      this.setState(
        { 
          indicatorXPos: -1000, 
          indicatorYPos: -1000, 
          tooltipXPos: -1000, 
          tooltipYPos: -1000 
        }
      );
      React.render(this.renderCurrentStep(), this._target);
      this.calculatePlacement();
    },

    _unrenderLayer: function() {
      React.unmountComponentAtNode(this._target);
    },

    componentDidUpdate: function(prevProps, prevState) {
      var hasNewIndex = this.state.currentIndex !== prevState.currentIndex;
      var hasNewStep = !!this.settings.steps[this.state.currentIndex];
      var hasNewIndicatorX = this.state.indicatorXPos !== prevState.indicatorXPos;
      var hasNewIndicatorY = this.state.indicatorYPos !== prevState.indicatorYPos;
      var hasNewTooltipX = this.state.indicatorXPos !== prevState.indicatorXPos;
      var hasNewTooltipY = this.state.indicatorYPos !== prevState.indicatorYPos;

      var didToggleTooltip = this.state.showTooltip && this.state.showTooltip !== prevState.showTooltip;

      if ( (hasNewIndex && hasNewStep) || didToggleTooltip || hasNewIndicatorX || hasNewIndicatorY || hasNewTooltipX || hasNewTooltipY) {
        this._renderLayer();
      } else if ( !hasNewStep ) {
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
      $(window).on('resize', this.calculatePlacement);
    },

    componentWillUnmount: function() {
      this._unrenderLayer();
      document.body.removeChild(this._target);
      $(window).off('resize', this.calculatePlacement);
    },

    setTourSteps: function(steps, cb) {
      cb = cb || function() {};

      this.setState(this.getInitialState(), function() {
        this.settings.steps = steps;
        cb();
      }.bind(this));
    },

    getUserTourProgress: function() {
      return {
        index: this.state.currentIndex,
        percentageComplete: (this.state.currentIndex/this.settings.steps.length)*100,
        step: this.settings.steps[this.state.currentIndex]
      };
    },

    preventWindowOverflow: function(value, axis, elWidth, elHeight) {
      var winWidth = parseInt($(window).width());
      var docHeight = parseInt($(document).height());

      void 0;
      void 0;

      if ( axis.toLowerCase() === 'x' ) {
        if ( value + elWidth > winWidth ) {
          void 0;
          value = winWidth - elWidth;
        } else if ( value < 0 ) {
          void 0;
          value = 0;
        }
      } else if ( axis.toLowerCase() === 'y' ) {
        if ( value + elHeight > docHeight ) {
          void 0;
          value = docHeight - elHeight;
        } else if ( value < 0 ) {
          void 0;
          value = 0;
        }
      }

      return value;
    },

    calculatePlacement: function() {
      var step = this.settings.steps[this.state.currentIndex];
      var $target = $(step.element);
      var offset = $target.offset();
      var targetWidth = $target.outerWidth();
      var targetHeight = $target.outerHeight();
      var indicatorPosition = step.indicatorPosition ? step.indicatorPosition.toLowerCase() : step.position.toLowerCase(); 
      var tooltipPosition = step.tooltipPosition ? step.tooltipPosition.toLowerCase() : step.position.toLowerCase(); 
      tooltipPosition = tooltipPosition.toLowerCase();
      var topRegex = new RegExp('top', 'gi');
      var bottomRegex = new RegExp('bottom', 'gi');
      var leftRegex = new RegExp('left', 'gi');
      var rightRegex = new RegExp('right', 'gi');
      var $element = this.state.showTooltip ? $('.tour-tooltip') : $('.tour-indicator');
      var elWidth = $element.outerWidth();
      var elHeight = $element.outerHeight();
      var indicatorPlacement = {
        x: -1000,
        y: -1000
      };
      var tooltipPlacement = {
        x: -1000,
        y: -1000
      };

      // Calculate x indicatorPosition
      if ( leftRegex.test(indicatorPosition) ) {
        indicatorPlacement.x = offset.left - elWidth/2;
      } else if ( rightRegex.test(indicatorPosition) ) {
        indicatorPlacement.x = offset.left + targetWidth - elWidth/2;
      } else {
        indicatorPlacement.x = offset.left + targetWidth/2 - elWidth/2;
      }

      // Calculate y indicatorPosition
      if ( topRegex.test(indicatorPosition) ) {
        indicatorPlacement.y = offset.top - elHeight/2;
      } else if ( bottomRegex.test(indicatorPosition) ) {
        indicatorPlacement.y = offset.top + targetHeight - elHeight/2;
      } else {
        indicatorPlacement.y = offset.top + targetHeight/2 - elHeight/2;
      }

      // Calculate x tooltipPosition
      if ( leftRegex.test(tooltipPosition) ) {
        tooltipPlacement.x = offset.left - elWidth/2;
      } else if ( rightRegex.test(tooltipPosition) ) {
        tooltipPlacement.x = offset.left + targetWidth - elWidth/2;
      } else {
        tooltipPlacement.x = offset.left + targetWidth/2 - elWidth/2;
      }

      // Calculate y tooltipPosition
      if ( topRegex.test(tooltipPosition) ) {
        tooltipPlacement.y = offset.top - elHeight/2;
      } else if ( bottomRegex.test(tooltipPosition) ) {
        tooltipPlacement.y = offset.top + targetHeight - elHeight/2;
      } else {
        tooltipPlacement.y = offset.top + targetHeight/2 - elHeight/2;
      }

      this.setState({
        indicatorXPos: this.preventWindowOverflow(indicatorPlacement.x, 'x', elWidth, elHeight),
        indicatorYPos: this.preventWindowOverflow(indicatorPlacement.y, 'y', elWidth, elHeight),
        tooltipXPos: this.preventWindowOverflow(tooltipPlacement.x, 'x', elWidth, elHeight),
        tooltipYPos: this.preventWindowOverflow(tooltipPlacement.y, 'y', elWidth, elHeight)
      });
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

      void 0;
    },

    renderCurrentStep: function() {
      var element = null;
      var currentStep = this.settings.steps[this.state.currentIndex];
      var $target = currentStep && currentStep.element ? $(currentStep.element) : null;
      var cssPosition = $target ? $target.css('position') : null;

      if ( $target && $target.length ) {
        if ( this.state.showTooltip ) {
          element = (
            React.createElement(Tooltip, {cssPosition: cssPosition, 
                     xPos: this.state.tooltipXPos, 
                     yPos: this.state.tooltipYPos, 
                     text: currentStep.text, 
                     closeTooltip: this.closeTooltip})
          );
        } else {
          element = (
            React.createElement(Indicator, {cssPosition: cssPosition, 
                       xPos: this.state.indicatorXPos, 
                       yPos: this.state.indicatorYPos, 
                       handleIndicatorClick: this.handleIndicatorClick})
          );
        }
      }

      return element;
    }

  };

  return mixin;

};