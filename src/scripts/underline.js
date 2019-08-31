/* eslint-disable import/first */
// eslint-disable-next-line no-underscore-dangle
const __DEV__ = false;

import config from '../../config';

import formatMarkingElementForWhatsapp from '../modules/markingElement/whatsapp';
import { formatMarkingElement as formatMarkingElementForSlack } from '../modules/slack';

import log from '../helpers/helper-logger';

const l = i => (__DEV__ ? log(i) : null); 

const UNDERLINE_COLOR = config.colors.primary[3];

function dec2hex(dec) {
  return ((`0${dec.toString(16)}`).substr(-2));
}

const generateRandomString = length => {
  const arr = new Uint8Array((length || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
};

const isChildlessTextNode = node =>
  !node.hasChildNodes() && node.nodeType === 3;

const isIncluded = (word, text) => text.includes(word) === true;

const getTextBeforeWord = (word, text) => {
  if (text === word) return undefined;

  const indexStart = 0;
  const indexEnd = text.indexOf(word) !== -1 ? text.indexOf(word) : undefined;

  const textBefore =
    indexStart !== undefined && indexEnd !== undefined
      ? text.substring(indexStart, indexEnd)
      : undefined;
  l(textBefore);

  return textBefore;
};

const getTextAfterWord = (word, text) => {
  if (text === word) return undefined;

  const indexStart = text.indexOf(word) + word.length;
  const indexEnd = text.length;

  const textAfter = text.substring(indexStart, indexEnd);
  l(textAfter);

  return textAfter;
};

const createTextElement = word => document.createTextNode(word);

const CSS_CLASS_NAME = `fl-${generateRandomString(10)}`;
const CSS_CLASS_STYLE = `.${CSS_CLASS_NAME} 
{ 
  border-color: ${UNDERLINE_COLOR}; 
  border-bottom-width: 2.5px;
  border-bottom-style: solid;
  cursor: pointer;
  user-select:none;
  font-weight: normal;
  color: 'black';
}`;

const style = document.createElement("style");
style.type = "text/css";
style.innerHTML = CSS_CLASS_STYLE;
document.getElementsByTagName("head")[0].appendChild(style);

/* const createSpanElementWithUnderlinedClass = word => {
  const replacement = document.createElement("span");
  replacement.className = CSS_CLASS_NAME;
  replacement.innerHTML = word;
  return replacement;
}; */

const createSpanElementWithUnderlinedClass = (word, suggestions, onReplaced) => {
  suggestions.unshift(word);
  l(suggestions);

  const replacement = document.createElement('span');
  // replacement.className = CSS_CLASS_NAME;

  replacement.setAttribute("bar", "true")

  replacement.style.position = 'relative';
  replacement.style.zIndex = '2';

  replacement.style.cursor = 'pointer';
  replacement.style.userSelect = 'none';
  
  replacement.style.borderColor = '#6652FF';
  // replacement.style.borderColor = config.colors.gradientHorizontal; 

  replacement.style.borderBottomWidth = '2.5px';
  
  replacement.style.borderBottomStyle = 'solid';

  replacement.style.margin = 0;
  
  if (window.location.href.includes('web.whatsapp.com')) {
    formatMarkingElementForWhatsapp(replacement);
  } else 
  if (window.location.href.includes('slack.com')) {
    formatMarkingElementForSlack(replacement);
  } else 
  if (window.location.href.includes('outlook.live.com')) {
  } else {
    
  }

  // replacement.style.background = 'blue'
  // replacement.style.position = 'absolute';
  replacement.innerText = `${word}`;

  let index = 1;

  replacement.addEventListener('mousedown', e => e.preventDefault(), false);

  let wordToReplace = word;
  let wordReplacement = suggestions[index];

  replacement.addEventListener('mouseup', (event) => {

    l(`wordToReplace: ${wordToReplace} with wordReplacement: ${wordReplacement}`);

    ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////

    const previousContainer = document.getElementById('fl-list-container');

    if(previousContainer) {
      document.body.removeChild(previousContainer);
    }

    const listContainer = document.createElement('div');
    listContainer.id = 'fl-list-container'

    listContainer.style.position = 'absolute';

    listContainer.style.zIndex = '9999';

    listContainer.style.left = '50vw';
    listContainer.style.top = '50vh';

    listContainer.style.borderRadius = '10px';
    listContainer.style.boxShadow = '0 0 10 rgba(0,0,0, 0.25)';


    listContainer.style.transform = 'translateX(-50%) translateY(-50%)';

    listContainer.style.minWidth = '250px';
    listContainer.style.maxWidth = '300px';

    listContainer.style.minHeight = '300px';
    listContainer.style.background = '#39113E';

    listContainer.style.color = 'white';
    listContainer.style.fontFamily = 'Avenir';
    listContainer.style.fontWeight = 'bold';

    listContainer.style.paddingBottom= '35px';

    // Close 
    const img = document.createElement('img');
    img.src = chrome.extension.getURL("close.png");
    img.style.width = '15px';
    img.style.height = '15px';
    img.style.position = 'absolute';
    img.style.right = '0';

    img.style.cursor = 'pointer';


    img.style.margin = '25px';

    listContainer.appendChild(img);

    img.addEventListener('mouseup', (event) => {
      document.body.removeChild(listContainer);
    })
    

    // hover background


    document.body.appendChild(listContainer);

    suggestions.forEach((suggestion, i) => {

      const itemContainer = document.createElement('div');

      if(i === 0){
        itemContainer.innerText = `Möchtest du anstatt des Wortes "${suggestion}" lieber eine der folgenden Alternativen verwenden?`;
        itemContainer.style.marginTop = '60px';
        itemContainer.style.marginBottom = '15px';

      }

      if(i !== 0) {

        itemContainer.style.paddingTop = '5px';
        itemContainer.style.paddingBottom = '5px';
        
        itemContainer.style.color = 'white';
        itemContainer.style.cursor = 'pointer';

        itemContainer.innerText = suggestion;
        

        itemContainer.addEventListener('mouseover', (event) => {
          itemContainer.style.background = '#301034';
        })

        itemContainer.addEventListener('mouseout', (event) => {
          itemContainer.style.background = '#39113E';
        })

        itemContainer.addEventListener('mouseup', (event) => {
          replacement.textContent = suggestion;
          onReplaced(); // IMPORTANT:
          document.body.removeChild(listContainer);
        });

      }

      itemContainer.style.paddingLeft= '25px';
      itemContainer.style.paddingRight= '25px';


      listContainer.appendChild(itemContainer);

    });

    MicroModal.init();
    ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////
    
    // Change text
    // replacement.textContent = wordReplacement;
    
    wordToReplace = wordReplacement;

    index = suggestions.length - 1 > index ? index += 1 : 0;

    wordReplacement = suggestions[index];

    //onReplaced();
    
  });

  return replacement;
};

const isAlreadyModified = node => {
  if (node.hasAttribute && node.hasAttribute("bar")) {
    return true;
  }
};

/**
 * underline text in DOMNode
 */

const underline = (data, element, onModified, onReplaced) => {
  
  const word = data.word;
  const suggestions = data.suggestions;

  l(`We are looking for: ${word}`);

  function iterate(current) {

    // Check if DOMNode is already underlined
    if (isAlreadyModified(current)) return;

    const text = current.textContent;
    // l(`Current DOM Node is: ${current}, with text: ${text}`);
    if (isChildlessTextNode(current) && isIncluded(word, text)) {      

      // l(`There is a "${word}" in this: "${text}"`);
      l(`isIncluded(${word}, ${text}): ${isIncluded(word, text)}`);

      // Divide text
      const textBefore = getTextBeforeWord(word, text);
      const textAfter = getTextAfterWord(word, text);

      // l(`(${word}, "${text}") before: ${textBefore}, after: ${textAfter}`);

      // Create nodes
      const nodeBefore = textBefore ? createTextElement(textBefore) : undefined;
      const nodeUnderlined = createSpanElementWithUnderlinedClass(
        word,
        suggestions,
        onReplaced,
      );
      const nodeAfter = textAfter ? createTextElement(textAfter) : undefined;

      const nodes = [
        nodeBefore !== undefined ? nodeBefore : '',
        nodeUnderlined,
        nodeAfter !== undefined ? nodeAfter : '',
      ];

      current.replaceWith(...nodes);
      
      // onModified
      if (onModified !== undefined) onModified();

    } else {
      const children = current.childNodes;
      for (let i = 0, len = children.length; i < len; i += 1) {
        iterate(children[i]);
      }
    }
  }

  iterate(element);

  return element;
};

/**
 * 
 * @param {*} node 
 * @param {*} chars 
 * @param {*} range 
 */
const createRange = (node, chars, range = document.createRange()) => {

  if (!range) {
    range.selectNode(node);
    range.setStart(node, 0);
    range.setEnd(node, chars.count);
  }

  if (chars.count === 0) {
    range.setEnd(node, chars.count);
  } else if (node && chars.count > 0) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.length < chars.count) {
        //chars.count -= node.textContent.length;
      } else {
        range.setEnd(node, chars.count);
        chars.count = 0;
      }
    } else {
      for (let lp = 0; lp < node.childNodes.length; lp += 1) {
        range = createRange(node.childNodes[lp], chars, range);
        if (chars.count === 0) {
          break;
        }
      }
    }
  }

  // l(range)

  return range;
};

const getCurrentCursorPositionInDOMNode = (node) => {
  try {
    let range = document.getSelection().getRangeAt(0);
    range = range.cloneRange();
    range.selectNodeContents(node);
    range.setEnd(range.endContainer, range.endOffset);
    const position = range.toString().length;
    l(`stored: ${position}`);
    return position;
  } catch {
    return 1;
  }
};

/**
 * setCursorAtPositionInDOMNode
 * @param {Position to take withing node} chars 
 * @param {DOM Node to set cursor} node 
 */
const setCursorAtPositionInDOMNode = (chars, node) => {

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Range
   * https://developer.mozilla.org/en-US/docs/Web/API/Selection
   */

  // [DEPRECATED (but maybe useful in the future)]
  //l(`restored: ${chars}`);

  //l('selection:');
  const selection = window.getSelection();
  //l(selection);

  //l('node:');
  //l(node.childNodes.length);

  const range = document.createRange();
  
  //range.selectNode(node.childNodes[node.childNodes.length - 1]);

  // Equivalent to:
  range.selectNodeContents(node);

  //range.setStart(node.childNodes[node.childNodes.length - 1], 0);
  //range.setEnd(node.childNodes[node.childNodes.length - 1], node.childNodes[node.childNodes.length - 1].childNodes.length);

  // Info: true = Select everything in range / false = Select nothing in range
  range.collapse(false);

  //l('range:');
  //l(range);

  selection.removeAllRanges();
  selection.addRange(range);

  //l('selection:');
  //l(selection);

};

export default underline;
export {
  CSS_CLASS_NAME,
  getCurrentCursorPositionInDOMNode,
  setCursorAtPositionInDOMNode,
};