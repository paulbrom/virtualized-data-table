import { Component } from 'react';
import PropTypes from 'prop-types';
import _isArray from 'lodash/isArray';
import ReactDOM from 'react-dom';
import { isInput, isMac } from './utils';

// this is a component which can grab keyup events and send them to the parent component
// via an onKey event
class KeyHandler extends Component {
  static propTypes = {
    keys: PropTypes.arrayOf(PropTypes.string),
    onKey: PropTypes.func.isRequired,
    ignoreInput: PropTypes.bool,
    getInputRef: PropTypes.func,
  };

  static defaultProps = {
    ignoreInput: false,
  };

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

  prvEventTargetIsRefDescendant = (evt) => {
    const { getInputRef } = this.props;
    if (getInputRef) {
      let inputRef = getInputRef();
      if (!_isArray(inputRef)) {
        inputRef = [inputRef];
      }
      return inputRef.reduce((isDescendant, refCur) => {
        if (!isDescendant) {
          // eslint-disable-next-line react/no-find-dom-node
          const refNode = ReactDOM.findDOMNode(refCur);
          if (refNode) {
            let node = evt.target;
            do {
              if (node === refNode) {
                return true;
              }
              node = node.parentNode;
            } while (node);
          }
        }
        return isDescendant;
      }, false);
    }
    return true;
  };

  prvHandleKey = (evt) => {
    const { ignoreInput, keys, onKey } = this.props;
    const { metaKey, ctrlKey, which } = evt;

    // don't handle undo/redo here - this will be handled in header.jsx
    if (isMac() ?
      (metaKey && (which === 90)) : // on mac, undo is meta-Z and redo is shift-meta-Z
      (ctrlKey && ((which === 89) || (which === 90))) // on win, undo is ctrl-Z and redo is ctrl-Y
    ) {
      return;
    }

    const shouldHandleKey = !keys || keys.includes(evt.code);
    const keyNotInInput = (
      !ignoreInput ||
      !(evt.target instanceof window.HTMLElement) ||
      !isInput(evt.target)
    );
    const targetInTable = this.prvEventTargetIsRefDescendant(evt) || (evt.target === document.body);
    if ((shouldHandleKey && keyNotInInput && targetInTable) || (which === 13)) {
      onKey(evt);
    }
  };

  /* ------ END Event Handlers ------ */

  /* ------ Rendering methods ------ */

  render() {
    return null;
  }

  /* ------ End Rendering methods ------ */
}

export default KeyHandler;
