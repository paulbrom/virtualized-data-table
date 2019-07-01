/* eslint react/require-render-return: "off" */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _isFunction from 'lodash/isFunction';
import renderIf from '../utils/renderIf';

const MOUNT_RENDER_DELAY_MSEC = 50;

class Cell extends PureComponent {
  static propTypes = {
    allowOverflow: PropTypes.bool,
    children: PropTypes.oneOfType([ // from react
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    className: PropTypes.string,
    mountRenderDelay: PropTypes.number,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    style: PropTypes.oneOfType([
      PropTypes.object, // eslint-disable-line react/forbid-prop-types
      PropTypes.func,
    ]),
    // properties below this line from react-virtualized
    rowData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    rowIndex: PropTypes.number,
    columnKey: PropTypes.string,
  };

  static defaultProps = {
    mountRenderDelay: MOUNT_RENDER_DELAY_MSEC,
  };

  state = {
    mounted: false,
  };

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

  handleMouseEnter = (evt) => {
    const {
      rowData,
      rowIndex,
      columnKey,
      onMouseEnter,
    } = this.props;
    if (onMouseEnter) {
      onMouseEnter(evt, rowData, rowIndex, columnKey);
    }
  };

  handleMouseLeave = (evt) => {
    const {
      rowData,
      rowIndex,
      columnKey,
      onMouseLeave,
    } = this.props;
    if (onMouseLeave) {
      onMouseLeave(evt, rowData, rowIndex, columnKey);
    }
  };

  handleClick = (evt) => {
    const {
      rowData,
      rowIndex,
      columnKey,
      onClick,
    } = this.props;
    if (onClick) {
      onClick(evt, rowData, rowIndex, columnKey);
    }
  };

  prvStartMountTimer = () => {
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
  };

  render() {
    const {
      children,
      rowData,
      rowIndex,
      columnKey,
      style,
      allowOverflow,
      className,
    } = this.props;
    const { mounted } = this.state;
    const cellStyle = {
      paddingLeft: 10,
      width: '100%',
      overflow: allowOverflow ? undefined : 'hidden',
      ...(_isFunction(style) ? style(rowData, rowIndex, columnKey) : style),
    };

    this.prvStartMountTimer();

    return renderIf(mounted, () => (
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
    ), (
      <div role="gridcell" />
    ));
  }
}

export default Cell;
