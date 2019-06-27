import _isFunction from 'lodash/isFunction';

/**
 * utility method to determine if the given element is an input element or an 'editable' element
 * @param {DOM element (not React!)} elem
 * @param {bool} orEditable (whether to also check for editability of non-input elements)
 * @returns {bool} whether it was an input, or editable element
 */
const isInput = (elem, orEditable = true) => {
  const isContentEditable = () => {
    const editable = elem.contentEditable || (_isFunction(elem.getAttribute) && elem.getAttribute('contenteditable'));
    return editable && (editable !== 'inherit');
  };
  return elem && (
    ((elem.tagName === 'INPUT') && elem.ownerDocument.activeElement === elem) ||
    ((elem.tagName === 'TEXTAREA') && elem.ownerDocument.activeElement === elem) ||
    (elem.getAttribute('role') === 'menuitem') ||
    (orEditable && isContentEditable())
  );
};

/**
 * utility method to detect if running on a Mac platform of some type (including mobile)
 * @returns {bool} whether running on a Mac platform
 */
const isMac = () => navigator.platform.toUpperCase().indexOf('MAC') >= 0;

export {
  isInput,
  isMac,
};
