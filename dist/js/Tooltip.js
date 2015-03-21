'use strict';

var React = require('react/addons');

var Tooltip = React.createClass({displayName: "Tooltip",

  propTypes: {
    cssPosition: React.PropTypes.string.isRequired,
    xPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    yPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    text: React.PropTypes.string.isRequired,
    closeTooltip: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      cssPosition: 'absolute',
      xPos: -1000,
      yPos: -1000,
      text: ''
    };
  },

  render: function() {
    var styles = {
      'position': this.props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
      'top': this.props.yPos,
      'left': this.props.xPos
    };

    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "tour-backdrop", onClick: this.props.closeTooltip}), 
        React.createElement("div", {className: "tour-tooltip", style: styles}, 
          React.createElement("p", null, this.props.text || ''), 
          React.createElement("div", {className: "tour-btn close", onClick: this.props.closeTooltip}, "Close")
        )
      )
    );
  }

});

module.exports = React.createFactory(Tooltip);