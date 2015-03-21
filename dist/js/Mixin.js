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
        xPos: -1000,
        yPos: -1000
      };
    },

    _renderLayer: function() {
      // By calling this method in componentDidMount() and componentDidUpdate(), you're effectively
      // creating a "wormhole" that funnels React's hierarchical updates through to a DOM node on an
      // entirely different part of the page.
      this.setState({ xPos: -1000, yPos: -1000 });
      React.render(this.renderCurrentStep(), this._target);
      this.calculatePlacement();
    },

    _unrenderLayer: function() {
      React.unmountComponentAtNode(this._target);
    },

    componentDidUpdate: function(prevProps, prevState) {
      var hasNewIndex = this.state.currentIndex !== prevState.currentIndex;
      var hasNewStep = !!this.settings.steps[this.state.currentIndex];
      var hasNewX = this.state.xPos !== prevState.xPos;
      var hasNewY = this.state.yPos !== prevState.yPos;
      var didToggleTooltip = this.state.showTooltip && this.state.showTooltip !== prevState.showTooltip;

      if ( (hasNewIndex && hasNewStep) || didToggleTooltip || hasNewX || hasNewY ) {
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
      var position = step.position.toLowerCase();
      var topRegex = new RegExp('top', 'gi');
      var bottomRegex = new RegExp('bottom', 'gi');
      var leftRegex = new RegExp('left', 'gi');
      var rightRegex = new RegExp('right', 'gi');
      var $element = this.state.showTooltip ? $('.tour-tooltip') : $('.tour-indicator');
      var elWidth = $element.outerWidth();
      var elHeight = $element.outerHeight();
      var placement = {
        x: -1000,
        y: -1000
      };

      // Calculate x position
      if ( leftRegex.test(position) ) {
        placement.x = offset.left - elWidth/2;
      } else if ( rightRegex.test(position) ) {
        placement.x = offset.left + targetWidth - elWidth/2;
      } else {
        placement.x = offset.left + targetWidth/2 - elWidth/2;
      }

      // Calculate y position
      if ( topRegex.test(position) ) {
        placement.y = offset.top - elHeight/2;
      } else if ( bottomRegex.test(position) ) {
        placement.y = offset.top + targetHeight - elHeight/2;
      } else {
        placement.y = offset.top + targetHeight/2 - elHeight/2;
      }

      this.setState({
        xPos: this.preventWindowOverflow(placement.x, 'x', elWidth, elHeight),
        yPos: this.preventWindowOverflow(placement.y, 'y', elWidth, elHeight)
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
                     xPos: this.state.xPos, 
                     yPos: this.state.yPos, 
                     text: currentStep.text, 
                     closeTooltip: this.closeTooltip})
          );
        } else {
          element = (
            React.createElement(Indicator, {cssPosition: cssPosition, 
                       xPos: this.state.xPos, 
                       yPos: this.state.yPos, 
                       handleIndicatorClick: this.handleIndicatorClick})
          );
        }
      }

      return element;
    }

  };

  return mixin;

};