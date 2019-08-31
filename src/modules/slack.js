/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
/* eslint-disable max-len */

const __DEV__ = true;
const THRESHOLD = 25;

import log from '../helpers/helper-logger';

const l = i => (__DEV__ ? log(i) : null); 

const findContainerElement = (elementClickedOn) => {

  /*
    Find container element (identified by attribute: data-qa="xxx")
  */
  let containerElement;
  
  let i = 0;

  let current = elementClickedOn.parentNode;

  while (containerElement === undefined && i < THRESHOLD) {
    if (current 
      && current.hasAttribute 
      && current.hasAttribute('data-qa')) {
      l(`identifyInputElement - [Slack] - getAttribute('data-qa'): ${current.getAttribute('data-qa')}`);
      containerElement = current;
    } 
    current = current.parentNode;
    i += 1; 
  }

  // l('[Slack] - identifiedContainerElement:');
  // l(containerElement);

  return containerElement;

};

const identifyContainerElement = (containerElement) => {

  let containerElementType;

  const attribute = containerElement.getAttribute('data-qa');

  if (attribute === 'message_editor') {
    containerElementType = 'editor';
  } else if (containerElement.hasAttribute
      && containerElement.hasAttribute('data-view-context') 
      && containerElement.getAttribute('data-view-context') === 'threads-flexpane') {
    containerElementType = 'threads-sidebar';
  } else if (containerElement.hasAttribute
    && containerElement.hasAttribute('data-view-context') 
    && containerElement.getAttribute('data-view-context') === 'threads-view') {
    containerElementType = 'threads-view';
  } else if (attribute === 'message_input') {
    containerElementType = 'main';
  } else if (attribute === 'legacy_search_header') {
    containerElementType = 'search';
  } else if (attribute === 'custom_status_input_text_input') {
    containerElementType = 'status';
  }

  l(`identifyInputElement - [Slack] - identifiedContainerElementType: ${containerElementType}`);

  return containerElementType;
};

const findInputElement = (elementClickedOn) => {
  return elementClickedOn.tagName === 'DIV' ? elementClickedOn : elementClickedOn.parentNode;
};

/**
 * handleInputElement (Slack).
 *
 * Handles detected input element on Slack.
 * @param {DOMNode} elementClickedOn The detected element of input action.
 * @return {[inputElement, widgetContainerElement]}
 */
const handleInputElement = (elementClickedOn) => {

  // (1/3) Find container element (identified by: must have attribute [data-qa="xxx"])
  const containerElement = findContainerElement(elementClickedOn);

  // (2/3) Identify found container element
  const containerElementType = identifyContainerElement(containerElement);

  // (3/3) Handle according to identified containerElementType
  switch (containerElementType) {
  
    case 'editor': {
        
      const element = document.createElement('button');
      element.className = 'c-button-unstyled c-texty_input__button';

      element.style.position = 'absolute';
      element.style.top = '9px';
      element.style.right = '38px';

      element.style.transform = 'scale(0.8)';
      element.style.display = 'flex';
      element.style.justifyContent = 'center';    

      // Find Buttons element
      const buttons = containerElement.querySelector("div[class='c-message__editor__input_container']");
      buttons.append(element);

      const widgetContainer = element;

      const inputElement = findInputElement(elementClickedOn);

      return [inputElement, widgetContainer];
    }

    case 'threads-view': {
      
      const element = document.createElement('button');
      element.className = 'c-button-unstyled c-texty_input__button';
      element.style.transform = 'scale(0.8)';
      element.style.marginTop = '-0.5px';    
      element.style.display = 'flex';
      element.style.justifyContent = 'center';    

      // Find Buttons element
      const buttons = containerElement.childNodes[containerElement.childNodes.length - 3];
      
      // Append
      buttons.append(element);

      const widgetContainer = element;

      const inputElement = findInputElement(elementClickedOn);

      return [inputElement, widgetContainer];

    }
    
    case 'threads-sidebar': {
      
      const element = document.createElement('div');
      element.setAttribute('tabindex', 5);
      element.style.transform = 'scale(0.8)';  
      element.style.marginRight = '25px';
      element.style.top = '-4px';
      element.style.display = 'flex';
      element.style.justifyContent = 'center';    
    
      const buttons = containerElement.childNodes[containerElement.childNodes.length - 3];
      
      buttons.style.display = 'flex';
      buttons.style.flexDirection = 'row';
      buttons.style.alignItems = 'center';
      buttons.style.justifyContent = 'flex-end';

      buttons.style.height = '25px';
      buttons.style.width = '100px';

      buttons.style.border = '0px solid blue';

      buttons.append(element);
      
      const widgetContainer = element;
    
      const inputElement = findInputElement(elementClickedOn);

      return [inputElement, widgetContainer];

    }

    case 'main': {
      
      const element = document.createElement('div');
      element.className = 'btn_unstyle msg_mentions_button';

      element.style.transform = 'scale(0.9)';
    
      element.style.marginTop = '-1px';
      element.style.marginRight = '58px';

      //element.style.right = '170px';
      element.style.paddingTop = '-2px';    
      element.style.marginLeft = '5px';    
      element.style.display = 'flex';
      element.style.justifyContent = 'center';    

      // Find buttons container element and append
      const buttons = containerElement.querySelector("div[class='ql-buttons']");
      buttons.append(element);
    
      const widgetContainer = element;  
      const inputElement = findInputElement(elementClickedOn);

      return [inputElement, widgetContainer];
    
    }

    default: {
      l(`[Slack] - disabled on this ContainerElementType: ${containerElementType}`);
      
      return [null, null];
    }
  
  }
  
};

const formatTextElements = (originalTextElement, clonedTextElement) => {
  originalTextElement.style.top = '0';
  originalTextElement.style.width = '82.5%';
};

const onKeyDown = (originalTextElement, clonedTextElement) => {
    
  /**
   * Keep width
   */
  clonedTextElement.style.width = window.getComputedStyle(originalTextElement).width;

  /**
   * Clear placeholder
   */
  const placeholder = originalTextElement.parentNode.childNodes[originalTextElement.parentNode.childNodes.length - 1];
  placeholder.innerHTML = '';

};

const formatMarkingElement = (markingElement) => {
  markingElement.style.borderWidth = '1.5px'; 
};

export default handleInputElement;
export { formatMarkingElement, formatTextElements, onKeyDown };
