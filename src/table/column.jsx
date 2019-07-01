/* eslint react/require-render-return: "off" */
import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Column extends PureComponent { // eslint-disable-line max-len, react/prefer-stateless-function, react/require-render-return
  static propTypes = {
    columnKey: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    header: PropTypes.element, // eslint-disable-line react/no-unused-prop-types
    cell: PropTypes.oneOfType([ // eslint-disable-line react/no-unused-prop-types
      PropTypes.node,
      PropTypes.func,
    ]).isRequired,
    width: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  };

  render() {
    throw new Error('Column Group should never render - it should be converted to renders by the Table class!');
  }
}

export default Column;
