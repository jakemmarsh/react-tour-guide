/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var Indicator = React.createClass({displayName: "Indicator",

  propTypes: {
    cssPosition: React.PropTypes.string.isRequired,
    size: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    xPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    yPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    handleIndicatorClick: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      cssPosition: 'absolute',
      size: '30px',
      xPos: 0,
      yPos: 0
    };
  },

  render: function() {
    var styles = {
      'position': this.props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
      'top': this.props.yPos,
      'left': this.props.xPos,
      'width': this.props.size,
      'height': this.props.size
    };

    return (
      React.createElement("div", {className: "tour-indicator", style: styles, onClick: this.props.handleIndicatorClick})
    );
  }

});

module.exports = React.createFactory(Indicator);