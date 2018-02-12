import { Component } from 'react';
import PropTypes from 'prop-types';

class ColumnGroup extends Component { // eslint-disable-line max-len, react/prefer-stateless-function, react/require-render-return
  render() {
    throw new Error('Column Group should never render - it should be converted to Columns by the Table class!');
  }
}

ColumnGroup.propTypes = {
  hidden: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  header: PropTypes.element, // eslint-disable-line react/no-unused-prop-types
};

ColumnGroup.defaultProps = {
  hidden: false,
  header: undefined,
};

export default ColumnGroup;
