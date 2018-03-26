import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const MOUNT_RENDER_DELAY_MSEC = 50;

class Cell extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      mounted: false,
    };
  }

  componentDidMount() {
    this.prvStartMountTimer();
  }

  componentWillUnmount() {
    if (this.mountTimer) {
      console.error('++ cleared mounttimer');
      clearTimeout(this.mountTimer);
      this.mountTimer = null;
    }
    this.setState({
      mounted: false,
    });
  }

  prvStartMountTimer() {
    const { mountRenderDelay } = this.props;
    const { mounted } = this.state;
    if (!mounted) {
      if (this.mountTimer) {
        clearTimeout(this.mountTimer);
      }
      this.mountTimer = setTimeout(() => {
        this.setState({
          mounted: true,
        });
      }, mountRenderDelay);
    }
  }

  render() {
    const { mounted } = this.state;
    if (!mounted) {
      return <div role="gridcell" />;
    }

    const {
      children,
      style,
      allowOverflow,
      onClick,
      onMouseEnter,
      onMouseLeave,
      className,
    } = this.props;
    let cellStyle = _.assign({}, {
      paddingLeft: 10,
    }, allowOverflow ? {} : {
      overflow: 'hidden',
    }, style);
    cellStyle = _.assign({}, { width: '100%' }, cellStyle);

    this.prvStartMountTimer();

    return (
      <div // eslint-disable-line max-len,jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
        className={className}
        style={cellStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        role="gridcell"
      >
        {children}
      </div>
    );
  }
}

Cell.propTypes = {
  allowOverflow: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string,
  children: PropTypes.node, // from React
  mountRenderDelay: PropTypes.number,
};

Cell.defaultProps = {
  allowOverflow: undefined,
  onClick: undefined,
  onMouseEnter: undefined,
  onMouseLeave: undefined,
  style: undefined,
  className: undefined,
  children: undefined,
  mountRenderDelay: MOUNT_RENDER_DELAY_MSEC,
};

export default Cell;
