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

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.prvStartMountTimer();
  }

  componentWillUnmount() {
    if (this.mountTimer) {
      clearTimeout(this.mountTimer);
      this.mountTimer = null;
    }
    this.setState({
      mounted: false,
    });
  }

  handleMouseEnter(e) {
    const {
      rowData,
      rowIndex,
      columnKey,
      onMouseEnter,
    } = this.props;
    if (onMouseEnter) {
      onMouseEnter(e, rowData, rowIndex, columnKey);
    }
  }

  handleMouseLeave(e) {
    const {
      rowData,
      rowIndex,
      columnKey,
      onMouseLeave,
    } = this.props;
    if (onMouseLeave) {
      onMouseLeave(e, rowData, rowIndex, columnKey);
    }
  }

  handleClick(e) {
    const {
      rowData,
      rowIndex,
      columnKey,
      onClick,
    } = this.props;
    if (onClick) {
      onClick(e, rowData, rowIndex, columnKey);
    }
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
      rowData,
      rowIndex,
      columnKey,
      style,
      allowOverflow,
      className,
    } = this.props;
    let cellStyle = _.assign({}, {
      paddingLeft: 10,
    }, allowOverflow ? {} : {
      overflow: 'hidden',
    }, _.isFunction(style) ? style(rowData, rowIndex, columnKey) : style);
    cellStyle = _.assign({}, { width: '100%' }, cellStyle);

    this.prvStartMountTimer();

    return (
      <div // eslint-disable-line max-len,jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
        className={className}
        style={cellStyle}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        role="gridcell"
      >
        {children}
      </div>
    );
  }
}

Cell.propTypes = {
  rowData: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  rowIndex: PropTypes.number, // from react-virtualized
  columnKey: PropTypes.string, // from react-virtualized
  allowOverflow: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  style: PropTypes.oneOfType([
    PropTypes.object, // eslint-disable-line react/forbid-prop-types
    PropTypes.func,
  ]),
  className: PropTypes.string,
  children: PropTypes.node, // from React
  mountRenderDelay: PropTypes.number,
};

Cell.defaultProps = {
  rowData: undefined,
  rowIndex: undefined,
  columnKey: undefined,
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
