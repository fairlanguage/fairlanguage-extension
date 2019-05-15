/* eslint-disable import/first */
// eslint-disable-next-line no-underscore-dangle
const __DEV__ = true;
import log from '../helpers/helper-logger';

const l = i => (__DEV__ ? log(i) : null); 

/**
 * Identify known container/wrapper type
 * 
 * There are three input elements on telegrams's web app:
 * 
 * 1. 'main': The main tweet box in the timeline
 * (attribute: class="timeline-tweetbox")
 * 2. 'reply': Modal popping up when clicking 'reply' on a tweet in the timeline 
 * (attribute: class="modal-tweet-form-container")
 * 3. 'retweet': Modal popping up when clicking 'retweet' on a tweet in the timeline 
 * (attribute: class="RetweetDialog-commentBox")
 * 4. 'message' : Modal popping up when clicking 'Direct message' on a tweet in the timeline 
 * (attribute: class="DMActivity-container")
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
    if (current.className) {
      switch (current.className) {
        case 'im_send_form_wrap1':
          container = current;
          type = 'main';
          break;
        default:
          type = undefined;
      }
    }

    if (!current.parentNode) container = null;
    
    current = current.parentNode;
    i += 1;
  }

  l(`container: ${container}`);

  switch (type) {

    case 'main': {

        const con = document.getElementsByClassName('im_send_buttons_wrap clearfix')[0];

        const widgetElement = document.createElement('div');
        widgetElement.style.width = '26px';
        widgetElement.style.height = '24px';
        widgetElement.style.display = 'flex';
        widgetElement.style.alignItems = 'center';
        widgetElement.style.justifyContent = 'center';
      
        widgetElement.style.marginTop = '2px';
      
        con.append(widgetElement);
      
        document.getElementsByClassName('composer_emoji_panel')[0].remove();      

      /**
       * Find input element
       */
      const inputElement = container.querySelectorAll('div[class="composer_rich_textarea"]')[0];

      return [inputElement, widgetElement];

    }

    default:

      log(`[Telegram] - disabled on this identifiedInputElementType: ${type}`);

      return [null, null];

  }

};

const formatTextElements = (originalTextElement, clonedTextElement) => {
  originalTextElement.style.top = '0px';
  originalTextElement.style.width = '100%';

  clonedTextElement.addEventListener('click', () => {
    originalTextElement.focus();
  });
  
  clonedTextElement.addEventListener('focus', () => {
    originalTextElement.focus();
  });

  clonedTextElement.setAttribute('data-attachment-placeholder', '');
};

const onKeyDown = (originalTextElement, clonedTextElement) => {
  clonedTextElement.setAttribute('data-attachment-placeholder', '');
};

const formatMarkingElement = (markingElement) => {
  
};

export default identifyInputElement;
export { formatMarkingElement, formatTextElements, onKeyDown };
