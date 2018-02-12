import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { isInput } from './utils';

const FLOATING_BUTTON_SIZE = 60;

// this is a non-rendering component which can subscribe to copy/paste messages
class ClipboardHelper extends Component {
  constructor(props, context) {
    super(props, context);

    this.prvHandleCut = this.prvHandleCut.bind(this);
    this.prvHandleCopy = this.prvHandleCopy.bind(this);
    this.prvHandlePaste = this.prvHandlePaste.bind(this);
  }

  /* ------ Lifecycle Methods ------ */

  componentDidMount() {
    window.document.addEventListener('cut', this.prvHandleCut);
    window.document.addEventListener('copy', this.prvHandleCopy);
    window.document.addEventListener('paste', this.prvHandlePaste);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    window.document.removeEventListener('cut', this.prvHandleCut);
    window.document.removeEventListener('copy', this.prvHandleCopy);
    window.document.removeEventListener('paste', this.prvHandlePaste);
  }

  /* ------ END Lifecycle Methods ------ */

  /* ------ Event Handlers ------ */

  prvEventTargetIsAllowedInput(evt, isCutCopy) {
    const {
      allowInputCutCopy,
      allowEditableCutCopy,
      allowInputPaste,
      allowEditablePaste,
    } = this.props;
    const allowInput = (isCutCopy ? allowInputCutCopy : allowInputPaste);
    const allowEditable = (isCutCopy ? allowEditableCutCopy : allowEditablePaste);
    return allowInput || !isInput(evt.target, allowEditable);
  }

  prvEventTargetIsRefDescendant(evt, isCutCopy) {
    const { getInputRef } = this.props;
    if (getInputRef) {
      // special - if target is an element than spans the entire page,
      // then assume target is ref descendant
      const computedStyle = window.getComputedStyle(evt.target);
      if ((parseInt(computedStyle.width, 10) === window.innerWidth) &&
        (parseInt(computedStyle.height, 10) === window.innerHeight)) {
        return this.prvEventTargetIsAllowedInput(evt, isCutCopy);
      }

      const refNode = ReactDOM.findDOMNode(getInputRef()); // eslint-disable-line max-len, react/no-find-dom-node
      let node = evt.target;
      let isDescendant = false;
      do {
        if (node === refNode) {
          isDescendant = true;
        }
        node = node.parentNode;
      } while (node && !isDescendant);

      if (!isDescendant) {
        // special - ignore any square buttons in target (like FABTooltip)
        // and assume target is ref descendant
        node = evt.target;
        while (node) {
          if (node.nodeName.toLowerCase() === 'button') {
            const rect = node.getBoundingClientRect();
            if ((rect.width === rect.height) && (rect.width < FLOATING_BUTTON_SIZE)) {
              return true;
            }
          }
          node = node.parentNode;
        }
      }
      return isDescendant;
    }
    return true;
  }

  prvHandleCut(evt) {
    const { onCut, pushBulkUpdate, popBulkUpdate } = this.props;
    if (onCut && this.prvEventTargetIsRefDescendant(evt, true /* isCutCopy */)) {
      pushBulkUpdate();
      onCut(evt);
      popBulkUpdate();
    }
  }

  prvHandleCopy(evt) {
    const { onCopy } = this.props;
    if (onCopy && this.prvEventTargetIsRefDescendant(evt, true /* isCutCopy */)) {
      onCopy(evt);
    }
  }

  prvHandlePaste(evt) {
    const { onPaste, pushBulkUpdate, popBulkUpdate } = this.props;
    if (onPaste && this.prvEventTargetIsRefDescendant(evt, false /* isCutCopy */)) {
      pushBulkUpdate();
      onPaste(evt);
      popBulkUpdate();
    }
  }

  /* ------ END Event Handlers ------ */

  /* ------ Rendering methods ------ */

  render() {
    return null;
  }

  /* ------ End Rendering methods ------ */
}

ClipboardHelper.propTypes = {
  onCut: PropTypes.func,
  onCopy: PropTypes.func,
  onPaste: PropTypes.func,
  getInputRef: PropTypes.func,
  allowInputCutCopy: PropTypes.bool,
  allowEditableCutCopy: PropTypes.bool,
  allowInputPaste: PropTypes.bool,
  allowEditablePaste: PropTypes.bool,
  pushBulkUpdate: PropTypes.func,
  popBulkUpdate: PropTypes.func,
};

ClipboardHelper.defaultProps = {
  onCut: undefined,
  onCopy: undefined,
  onPaste: undefined,
  getInputRef: undefined,
  allowInputCutCopy: true,
  allowEditableCutCopy: true,
  allowInputPaste: true,
  allowEditablePaste: true,
  pushBulkUpdate: () => {},
  popBulkUpdate: () => {},
};

export default ClipboardHelper;
