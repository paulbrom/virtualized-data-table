/* eslint react/require-render-return: "off" */
import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ColumnGroup extends PureComponent { // eslint-disable-line max-len, react/prefer-stateless-function, react/require-render-return
  static propTypes = {
    key: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    hidden: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    header: PropTypes.element, // eslint-disable-line react/no-unused-prop-types
  };

  static defaultProps = {
    hidden: false,
  };

  render() {
    throw new Error('Column Group should never render - it should be converted to Columns by the Table class!');
  }
}

export default ColumnGroup;
