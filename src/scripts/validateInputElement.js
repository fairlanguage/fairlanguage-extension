/* eslint-disable import/first */
// eslint-disable-next-line no-underscore-dangle
const __DEV__ = false;

import log from '../helpers/helper-logger';

const l = i => (__DEV__ ? log(i) : null); 

const validateInputElement = (elementClickedOn) => {
  
  /*
   *  First, if it might be already ours.
   */
  
  let isAlreadyInjected = false;

  let maxDepth = 10;
  let depth = 0;
  let el = elementClickedOn;
  while (!isAlreadyInjected && depth <= maxDepth) {
    if (el && el !== document && el !== document.body && el !== null) {
      isAlreadyInjected = el.hasAttribute && el.hasAttribute('fl') ? el.hasAttribute('fl') : isAlreadyInjected;
      el = el.parentNode && el.parentNode !== null ? el.parentNode : el;
    }
    depth += 1;
  }

  if (isAlreadyInjected) {
    log(`isAlreadyInjected: ${isAlreadyInjected}`);
    return false;
  }

  /*
   *  Second, detect if the element is any kind of text field.
   */

  // Is the element itself a HTML TextArea element?
  const isTextArea = elementClickedOn.type === 'textarea';
  log(`isTextArea: ${isTextArea}`);

  // Is the element an input element?
  const isIn = elementClickedOn.tagName && elementClickedOn.tagName.toLowerCase() === 'input';
  log(`isIn: ${isIn}`);

  // Is the element's type input?
  const isInput = elementClickedOn.type === 'input';
  log(`isInput: ${isInput}`);

  // Is the element's type search?
  const isSearch = elementClickedOn.type === 'search';
  log(`isSearch: ${isSearch}`);

  // Is the element itself content editable?
  const isContentEditable = elementClickedOn.hasAttribute && elementClickedOn.hasAttribute('contenteditable');
  log(`isContentIsEditable: ${isContentEditable}`);

  // Is a parent element's content editable?
  let isParentElementContentIsEditable;

  maxDepth = 10;

  depth = 0;
  el = elementClickedOn;
  while (!isParentElementContentIsEditable && depth <= maxDepth) {
    if (el !== document && el !== document.body && el !== null) {
      isParentElementContentIsEditable = el && el.hasAttribute && el.hasAttribute('contenteditable');
      el = el.parentNode && el.parentNode !== null ? el.parentNode : el;
    }
    depth += 1;
  }

  log(`isParentElementContentIsEditable (${depth}): ${isParentElementContentIsEditable}`);

  /**
   * Decide, according to what wr got.
   */

  // If none of that is the case it just wasn't a txt field (sorry :/).
  // if (isInput || isIn || isTextArea) return;
  if (!isIn && !isTextArea && !isSearch && !isContentEditable && !isParentElementContentIsEditable) {
    log('no inputElement');
    return false;
  }
   
  return true;
};

export default validateInputElement;
