/* eslint-disable import/first */
// eslint-disable-next-line no-underscore-dangle

import $ from "jquery";

const __DEV__ = true;
import log from '../helpers/helper-logger';

const l = i => (__DEV__ ? log(i) : null); 

/**
 * Identify known container/wrapper type
 * 
 * There are three input elements on messengers's web app:
 * 
 * 1. 'main': The main message line
 */

const identifyInputElement = (elementClickedOn) => {

  let type;

  /*
    Find known container/wrapper element
  */
  
  let i = 0;
  let container;
  let current = elementClickedOn;

  const THRESHOLD = 25;

  while (container === undefined && i < THRESHOLD) {
    l(i);
    if (current.hasAttribute 
      && current.hasAttribute('aria-label') 
      && current.getAttribute('aria-label') === 'New message') {
      type = 'message';
    }

    if (!current.parentNode) container = null;
    
    current = current.parentNode;
    i += 1;
  }

  l(`container: ${container}`);

  switch (type) {

    case 'message': {

      const con = document.getElementsByClassName('_4rv4')[0];

      const widgetContainer = document.createElement('li');
      widgetContainer.style.width = '35px';
      widgetContainer.style.height = '32px';
      widgetContainer.style.display = 'flex';
      widgetContainer.style.alignItems = 'center';
      widgetContainer.style.justifyContent = 'center';

      con.prepend(widgetContainer);

      const inputElement = document.querySelectorAll('[aria-label="Type a message..."]')[0];

      return [inputElement, widgetContainer];

    }

    default:

      log(`[Messenger] - disabled on this identifiedInputElementType: ${type}`);

      return [null, null];

  }

};

const formatTextElements = (originalTextElement, clonedTextElement) => {

 /*  if (document.querySelector('[id="placeholder-aqfn"').length > 0)
  document.querySelector('[id="placeholder-aqfn"')[0].innerText = '';
  if (document.querySelector('[id="placeholder-aqfn"').length > 1)
  document.querySelector('[id="placeholder-aqfn"')[1].innerText = ''; */

  originalTextElement.style.top = '0px';
  originalTextElement.style.minWidth = '100px';
};

const onKeyDown = (originalTextElement, clonedTextElement) => {
  if (document.querySelectorAll('[id="placeholder-aqfn"').length > 0)
  document.querySelectorAll('[id="placeholder-aqfn"')[0].innerText = '';
  if (document.querySelectorAll('[id="placeholder-aqfn"').length > 1)
  document.querySelectorAll('[id="placeholder-aqfn"')[1].innerText = '';
};

const formatMarkingElement = (markingElement) => {
  
};

const onReplaced = (originalTextElement, clonedTextElement) => {
  
  var e = $.Event("keyup");
    e.which = 8; // backspace key
  $( "#fl-original" ).trigger(e);
}

export default identifyInputElement;
export { formatMarkingElement, formatTextElements, onKeyDown, onReplaced };
