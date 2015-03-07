/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var Tooltip = React.createClass({

  propTypes: {
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
      size: '30px',
      xPos: 0,
      yPos: 0
    };
  },

  render: function() {
    var styles = {
      'zIndex': 999,
      'position': 'absolute',
      'top': this.props.yPos,
      'left': this.props.xPos,
      'width': this.props.size,
      'height': this.props.size
    };

    return (
      <div className="tour-indicator" style={styles} onClick={this.props.handleIndicatorClick} />
    );
  }

});

module.exports = React.createFactory(Tooltip);