/* eslint-disable import/first */
// eslint-disable-next-line no-underscore-dangle
const __DEV__ = true;
import log from '../helpers/helper-logger';

const l = i => (__DEV__ ? log(i) : null); 

/**
 * Identify known container/wrapper type
 * 
 * The following input elements twitter's web app are supported:
 * 
 * 1. 'tweet': The main tweet box in the timeline
 * (attribute: class="timeline-tweetbox")
 * 2. 'reply': Modal popping up when clicking 'reply' on a tweet in the timeline 
 * (attribute: class="modal-tweet-form-container")
 * 3. 'retweet': Modal popping up when clicking 'retweet' on a tweet in the timeline 
 * (attribute: class="RetweetDialog-commentBox")
 * 4. 'message' : Modal popping up when clicking 'Direct message' on a tweet in the timeline 
 * (attribute: class="DMActivity-container")
 * 5. 'compose' : Modal popping up when clicking 'tweet' on the upper right 
 * (attribute: class="modal-content TweetstormDialog-content")
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
    // l(i);
    if (current.className) {
      switch (current.className) {
        case 'tweet-box-content': 
          container = current;
          type = 'tweet';
          break;
        case 'timeline-tweet-box':         
          container = current;
          type = 'tweet';
          break;
        case 'modal-tweet-form-container':
          container = current;
          type = 'reply';        
          break;
        case 'RetweetDialog-commentBox':
          container = current;
          type = 'retweet';        
          break;
        case 'DMActivity-container':
          container = current;
          type = 'message';        
          break;
        case 'modal-content TweetstormDialog-content':
          container = current;
          type = 'compose';   
          break;
        default:
          type = undefined;
      }
    }

    if (!current.parentNode) container = null;
    
    current = current.parentNode;
    i += 1;
  }

  // alert(type);
  l(`type: ${type}`);

  l(`container: ${container}`);

  switch (type) {

    case 'compose': {

      const widgetContainer = document.createElement('span');

      widgetContainer.className = 'TweetBoxExtras-item';

      // widgetContainer.style.position = 'absolute';
      // widgetContainer.style.right = '0px';
      widgetContainer.style.marginRight = '15px';
      widgetContainer.style.marginLeft = '7.5px';

      widgetContainer.style.display = 'inline-flex';
      widgetContainer.style.alignItems = 'center';
      widgetContainer.style.justifyContent = 'center';

      const tweetBoxExtrasElement = container.parentNode.querySelectorAll('div[class="TweetBoxExtras tweet-box-extras"]')[0];

      tweetBoxExtrasElement.style.display = 'flex';
      tweetBoxExtrasElement.style.alignItems = 'center';
      tweetBoxExtrasElement.style.justifyContent = 'center';
      
      tweetBoxExtrasElement.insertBefore(widgetContainer, tweetBoxExtrasElement.childNodes[0]);

      const inputElement = container.querySelectorAll('div[name="tweet"]')[0];

      return [inputElement, widgetContainer];

    }

    case 'message': {

      const widgetContainer = document.createElement('span');

      widgetContainer.className = 'TweetBoxExtras-item';

      // widgetContainer.style.position = 'absolute';
      // widgetContainer.style.right = '0px';
      widgetContainer.style.marginRight = '15px';
      widgetContainer.style.marginLeft = '7.5px';

      widgetContainer.style.display = 'inline-flex';
      widgetContainer.style.alignItems = 'center';
      widgetContainer.style.justifyContent = 'center';

      const tweetBoxExtrasElement = container.querySelectorAll('div[class="TweetBoxExtras"]')[0];
      tweetBoxExtrasElement.style.display = 'flex';
      tweetBoxExtrasElement.style.alignItems = 'center';
      tweetBoxExtrasElement.style.justifyContent = 'center';
      
      tweetBoxExtrasElement.insertBefore(widgetContainer, tweetBoxExtrasElement.childNodes[0]);

      const inputElement = container.querySelectorAll('div[id="tweet-box-dm-conversation"]')[0];

      return [inputElement, widgetContainer];

    }

    case 'retweet': {

      const widgetContainer = document.createElement('span');

      widgetContainer.className = 'TweetBoxExtras-item';

      widgetContainer.style.left = '6px';
      widgetContainer.style.marginRight = '15px';
      widgetContainer.style.marginTop = '3.5px';

      widgetContainer.style.display = 'inline-flex';
      widgetContainer.style.alignItems = 'center';
      widgetContainer.style.justifyContent = 'center';

      /* const tweetBoxExtrasElement = container.querySelectorAll('div[class="TweetBoxExtras tweet-box-extras"]')[0];
      tweetBoxExtrasElement.insertBefore(widgetContainer, tweetBoxExtrasElement.childNodes[0]); */

      container.append(widgetContainer);

      const inputElement = container.querySelectorAll('div[id="retweet-with-comment"]')[0];

      return [inputElement, widgetContainer];

    }

    case 'reply': {

      const widgetContainer = document.createElement('span');

      widgetContainer.className = 'TweetBoxExtras-item';

      widgetContainer.style.left = '6px';
      widgetContainer.style.marginRight = '15px';
      widgetContainer.style.top = '-5px';

      widgetContainer.style.display = 'inline-flex';
      widgetContainer.style.alignItems = 'center';
      widgetContainer.style.justifyContent = 'center';

      const tweetBoxExtrasElement = container.querySelectorAll('div[class="TweetBoxExtras tweet-box-extras"]')[0];
      tweetBoxExtrasElement.insertBefore(widgetContainer, tweetBoxExtrasElement.childNodes[0]);

      const inputElement = container.querySelectorAll('div[id="tweet-box-global"]')[0];

      return [inputElement, widgetContainer];

    }

    case 'tweet': {

      const widgetContainer = document.createElement('span');

      widgetContainer.className = 'TweetBoxExtras-item';

      widgetContainer.style.left = '6px';
      widgetContainer.style.marginRight = '15px';
      widgetContainer.style.top = '-6px';

      widgetContainer.style.display = 'inline-flex';
      widgetContainer.style.alignItems = 'center';
      widgetContainer.style.justifyContent = 'center';

      /**
       * Find input element inside this element (attribute: id="tweet-box-home-timeline")
       */
        
      const tweetBoxExtrasElement = container.querySelectorAll('div[class="TweetBoxExtras tweet-box-extras"]')[0];
      tweetBoxExtrasElement.insertBefore(widgetContainer, tweetBoxExtrasElement.childNodes[1]);

      // Find input element
      const inputElement = container.querySelectorAll('div[contenteditable="true"]')[0];

      /**
       * Hiding ghost element
       * (Since the input model closes after submitting the tweet)
       */

      // Find button
      const submitButton = container.querySelectorAll('div[class="TweetBoxToolbar-tweetButton tweet-button"]')[0];

      // Add click event handler
      if (submitButton) {
        submitButton.addEventListener('click', () => {

          const ghost = container.querySelectorAll('div[id="fl-clone"]')[0];

          ghost.style.opacity = 0;

        });
      }

      return [inputElement, widgetContainer];
    
    }

    default:

      log(`[Twitter] - disabled on this identifiedInputElementType: ${type}`);

      return [null, null];

  }

};

const formatTextElements = (originalTextElement, clonedTextElement) => {
  originalTextElement.style.top = '0px';
  originalTextElement.style.minWidth = '100px';

  clonedTextElement.addEventListener('click', () => {
    originalTextElement.focus();
  });
  
  clonedTextElement.addEventListener('focus', () => {
    originalTextElement.focus();
  });

  clonedTextElement.setAttribute('data-attachment-placeholder', '');
};

const onKeyDown = (originalTextElement, clonedTextElement) => {

  clonedTextElement.style.opacity = 1;

  // TODO: well... 

  clonedTextElement.setAttribute('data-attachment-placeholder', '');
  clonedTextElement.setAttribute('data-placeholder-default', '');

  originalTextElement.setAttribute('data-attachment-placeholder', '');
  originalTextElement.setAttribute('data-placeholder-default', '');

  clonedTextElement.setAttribute('data-attachment-reply', '');
  clonedTextElement.setAttribute('data-placeholder-reply', '');

  originalTextElement.setAttribute('data-attachment-reply', '');
  originalTextElement.setAttribute('data-placeholder-reply', '');

  clonedTextElement.setAttribute('data-placeholder-add-another-tweet', '');
  clonedTextElement.setAttribute('data-placeholder-add-another-tweet', '');

  originalTextElement.setAttribute('data-placeholder-add-another-tweet', '');
  originalTextElement.setAttribute('data-placeholder-add-another-tweet', '');
  
};

const formatMarkingElement = (markingElement) => {
  
};

export default identifyInputElement;
export { formatMarkingElement, formatTextElements, onKeyDown };
