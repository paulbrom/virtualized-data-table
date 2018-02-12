import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Cell = (props) => {
  const {
    children,
    style,
    allowOverflow,
    onClick,
    onMouseEnter,
    onMouseLeave,
    className,
  } = props;
  let cellStyle = _.assign({}, {
    paddingLeft: 10,
  }, allowOverflow ? {} : {
    overflow: 'hidden',
  }, style);
  cellStyle = _.assign({}, { width: '100%' }, cellStyle);
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
};

Cell.propTypes = {
  allowOverflow: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string,
  children: PropTypes.node, // from React
};

Cell.defaultProps = {
  allowOverflow: undefined,
  onClick: undefined,
  onMouseEnter: undefined,
  onMouseLeave: undefined,
  style: undefined,
  className: undefined,
  children: undefined,
};

export default Cell;
