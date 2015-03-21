'use strict';

var React = require('react/addons');

var Tooltip = React.createClass({

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
      <div>
        <div className="tour-backdrop" onClick={this.props.closeTooltip} />
        <div className="tour-tooltip" style={styles}>
          <p>{this.props.text || ''}</p>
          <div className="tour-btn close" onClick={this.props.closeTooltip}>Close</div>
        </div>
      </div>
    );
  }

});

module.exports = React.createFactory(Tooltip);