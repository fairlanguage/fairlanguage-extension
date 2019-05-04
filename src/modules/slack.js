/* eslint-disable import/first */
// eslint-disable-next-line no-underscore-dangle
const __DEV__ = false;
import log from '../helpers/helper-logger';

const l = i => (__DEV__ ? log(i) : null); 

let type;

const identifyInputElement = (elementClickedOn) => {

  /*
    Find message container/wrapper element ( attribute: data-q="message_input")
  */
  
  let i = 0;
  let container;
  let current = elementClickedOn.parentNode;

  const THRESHOLD = 25;

  while (container === undefined && i < THRESHOLD) {
    if (current 
      && current.hasAttribute 
      && current.hasAttribute('data-qa')) {
      container = current;
    } 
    current = current.parentNode;
    i += 1; 
  }

  // log(container);

  /*
    Identify elements type
  */

  const attribute = container.getAttribute('data-qa');

  if (attribute === 'message_editor') {
    type = 'editor';
  } else if (container.hasAttribute
      && container.hasAttribute('data-view-context') 
      && container.getAttribute('data-view-context') === 'threads-flexpane') {
    type = 'threads-sidebar';
  } else if (container.hasAttribute
    && container.hasAttribute('data-view-context') 
    && container.getAttribute('data-view-context') === 'threads-view') {
    type = 'threads-view';
  } else if (attribute === 'message_input') {
    type = 'main';
  }

  l(`[Slack] - identifiedInputElementType: ${type}`);

  /**
   * Position widget according to identified type
   */

  let textElement;
  let widgetContainer;
  let element;

  let buttons;

  switch (type) {
    case 'editor':
      
      element = document.createElement('button');
      element.className = 'c-button-unstyled c-texty_input__button';

      element.style.position = 'absolute';
      element.style.top = '9px';
      element.style.right = '38px';

      element.style.transform = 'scale(0.8)';
      element.style.display = 'flex';
      element.style.justifyContent = 'center';    

      element.addEventListener('click', () => {
        alert('I am flamingo.');
      });

      // Find Buttons element
      buttons = container.querySelector("div[class='c-message__editor__input_container']");
      buttons.append(element);

      if (elementClickedOn.tagName === 'DIV') {
        textElement = elementClickedOn;
      }

      if (elementClickedOn.tagName === 'P') {
        textElement = elementClickedOn.parentNode;
      }

      widgetContainer = element;

      return [textElement, widgetContainer];
    case 'threads-view':
      
      element = document.createElement('button');
      element.className = 'c-button-unstyled c-texty_input__button';
      // element.setAttribute("tabindex", 5)

      element.style.transform = 'scale(0.8)';

      // element.style.transform = 'scale(0.8)';

      //element.style.marginRight = '25px';
      element.style.marginTop = '-0.5px';    
      //element.style.marginLeft = '5px';    
      // element.style.marginRight = '25px';
      //element.style.top = '-4px';
      element.style.display = 'flex';
      // element.style.position = 'relative';

      element.style.justifyContent = 'center';    

      element.addEventListener('click', () => {
        alert('I am flamingo.');
      });

      // Find Buttons element
      buttons = container.childNodes[container.childNodes.length-3]
      
      /* buttons.style.display = 'flex';
      buttons.style.flexDirection = 'column';
      buttons.style.alignItems = 'center';
      buttons.style.justifyContent = 'flex-end';

      buttons.style.height = '100%';
      //buttons.style.width = '100px';

      buttons.style.bottom = '6px';

      buttons.style.border = '0px solid blue'; */

      buttons.append(element)

      for(const child of buttons.childNodes) {
        //child.style.position = 'relative';
      }
      
      //return
      // .insertBefore(element, container.parentNode.querySelector('[class="ql-button"]').querySelector('[aria-label="Emoji menu"]'))

      if (elementClickedOn.tagName === 'DIV') {
      textElement = elementClickedOn;
      }

      if (elementClickedOn.tagName === 'P') {
      textElement = elementClickedOn.parentNode;
      }

      widgetContainer = element;

      return [textElement, widgetContainer];
      
    case 'threads-sidebar':
      
      element = document.createElement('div');
      //element.className = "c-button-unstyled c-texty_input__button";
      element.setAttribute("tabindex", 5)

      element.style.transform = 'scale(0.8)';
    
      //element.style.marginRight = '25px';
      //element.style.marginTop = 'px';    
      //element.style.marginLeft = '5px';    
      element.style.marginRight = '25px';
      element.style.top = '-4px';
      element.style.display = 'flex';
      element.style.justifyContent = 'center';    
    
      element.addEventListener('click', () => {
        alert('I am flamingo.');
      });

      // Find Buttons element
      buttons = container.childNodes[container.childNodes.length-3]
      
      buttons.style.display = 'flex';
      buttons.style.flexDirection = 'row';
      buttons.style.alignItems = 'center';
      buttons.style.justifyContent = 'flex-end';

      buttons.style.height = '25px';
      buttons.style.width = '100px';

      buttons.style.border = '0px solid blue';

      buttons.append(element);
      
      // return
      // .insertBefore(element, container.parentNode.querySelector('[class="ql-button"]').querySelector('[aria-label="Emoji menu"]'))
    
      if (elementClickedOn.tagName === 'DIV') {
        textElement = elementClickedOn;
      }
    
      if (elementClickedOn.tagName === 'P') {
        textElement = elementClickedOn.parentNode;
      }
    
      widgetContainer = element;
    
      return [textElement, widgetContainer];

    case 'main':
      
      element = document.createElement('div');
      element.className = 'btn_unstyle msg_mentions_button';

      element.style.transform = 'scale(0.9)';
    
      element.style.right = '70px';
      element.style.paddingTop = '-1px';    
      element.style.marginLeft = '5px';    
      element.style.display = 'flex';
      element.style.justifyContent = 'center';    
    
      element.addEventListener('click', () => {
        alert('I am flamingo.');
      });
        
      container.parentNode.insertBefore(element, container.querySelector('[aria-label="Insert mention"]'));
    
      if (elementClickedOn.tagName === 'DIV') {
        textElement = elementClickedOn;
      }
    
      if (elementClickedOn.tagName === 'P') {
        textElement = elementClickedOn.parentNode;
      }
    
      widgetContainer = element;
    
      return [textElement, widgetContainer];

    default:

      log(`[Slack] - disabled on this identifiedInputElementType: ${type}`);

      return [null, null];

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

export default identifyInputElement;
export { formatMarkingElement, formatTextElements, onKeyDown };
