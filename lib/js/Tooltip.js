/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var Tooltip = React.createClass({

  propTypes: {
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
      xPos: 0,
      yPos: 0,
      text: ''
    };
  },

  render: function() {
    var styles = {
      'zIndex': 999,
      'position': 'absolute',
      'top': this.props.yPos,
      'left': this.props.xPos
    };

    return (
      <div className="tour-backdrop" onClick={this.props.closeTooltip}>
        <div className="tour-tooltip" style={styles}>
          <p>{this.props.text}</p>
          <div className="tour-btn close" onClick={this.props.closeTooltip}>Close</div>
        </div>
      </div>
    );
  }

});

module.exports = React.createFactory(Tooltip);