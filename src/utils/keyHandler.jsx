import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { isInput, isMac } from './utils';

// this is a component which can grab keyup events and send them to the parent component
// via an onKey event
class KeyHandler extends Component {
  constructor(props, context) {
    super(props, context);

    this.prvHandleKey = this.prvHandleKey.bind(this);
  }

  /* ------ Lifecycle Methods ------ */

  componentDidMount() {
    window.document.addEventListener('keydown', this.prvHandleKey);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.prvHandleKey);
  }

  /* ------ END Lifecycle Methods ------ */

  /* ------ Event Handlers ------ */

  prvEventTargetIsRefDescendant(evt) {
    const { getInputRef } = this.props;
    if (getInputRef) {
      const refNode = ReactDOM.findDOMNode(getInputRef()); // eslint-disable-line max-len, react/no-find-dom-node
      let node = evt.target;
      let isDescendant = false;
      do {
        if (node === refNode) {
          isDescendant = true;
        }
        node = node.parentNode;
      } while (node && !isDescendant);
      return isDescendant;
    }
    return true;
  }

  prvHandleKey(evt) {
    const { ignoreInput, keys, onKey } = this.props;
    const { metaKey, ctrlKey, which } = evt;

    // don't handle undo/redo here - this will be handled in header.jsx
    if (isMac() ?
      (metaKey && (which === 90)) : // on mac, undo is meta-Z and redo is shift-meta-Z
      (ctrlKey && ((which === 89) || (which === 90))) // on win, undo is ctrl-Z and redo is ctrl-Y
    ) {
      return;
    }

    if ((!keys || keys.includes(evt.code)) &&
      (!ignoreInput || !(evt.target instanceof window.HTMLElement) || !isInput(evt.target)) &&
      (this.prvEventTargetIsRefDescendant(evt) || (evt.target === document.body))) {
      onKey(evt);
    }
  }

  /* ------ END Event Handlers ------ */

  /* ------ Rendering methods ------ */

  render() {
    return null;
  }

  /* ------ End Rendering methods ------ */
}

KeyHandler.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.string),
  onKey: PropTypes.func.isRequired,
  ignoreInput: PropTypes.bool,
  getInputRef: PropTypes.func,
};

KeyHandler.defaultProps = {
  keys: undefined,
  ignoreInput: false,
  getInputRef: undefined,
};

export default KeyHandler;
