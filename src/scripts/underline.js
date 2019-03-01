import config from '../../config';

const _DEV_ = false;
const l = i => {
  if (_DEV_) return console.log(i);
};

const UNDERLINE_COLOR = config.colors.primary[3];

function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
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

const createSpanElementWithUnderlinedClass = (word, suggestions, onChanged) => {
  suggestions.unshift(word);
  l(suggestions);

  const replacement = document.createElement("strong");
  replacement.className = CSS_CLASS_NAME;
  replacement.innerHTML = word;

  let index = 1;

  replacement.addEventListener("mousedown", e => e.preventDefault(), false);

  replacement.addEventListener("mouseup", event => {
    replacement.textContent = suggestions[index];
    replacement.style.borderBottomWidth = index === 0 ? "3px" : "0px";
    index = suggestions.length - 1 > index ? (index += 1) : 0;
    onChanged();
  });

  return replacement;
};

const isAlreadyModified = node => node.parentNode.tagName.toLowerCase() === "strong" &&
node.parentNode.classList.contains(CSS_CLASS_NAME);

/**
 *
 */

const underline = (data, element, onModified, onChanged) => {
  
  const word = data.word;
  const suggestions = data.suggestions;

  let found = false;
  l(`We are looking for: ${word}`);
  function iterate(current) {
    if (found) return;
    const text = current.textContent;
    //console.log(`Current DOM Node is: ${current}, with text: ${text}`);
    if (isChildlessTextNode(current) && isIncluded(word, text)) {
     
      // Check if DOMNode is already underlined
      if (isAlreadyModified(current)) return;

      // console.log(`There is a "${word}" in this: "${text}"`);

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
        onChanged,
      );
      const nodeAfter = textAfter ? createTextElement(textAfter) : undefined;

      const nodes = [
        nodeBefore !== undefined ? nodeBefore : '',
        nodeUnderlined,
        nodeAfter !== undefined ? nodeAfter : '',
      ];

      current.replaceWith(...nodes);
      
      found = true;

      // onModified
      if (onModified !== undefined) onModified();

    } else {
      const children = current.childNodes;
      for (let i = 0, len = children.length; i < len; i++) {
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

  // console.log(range)

  return range;
};

const getCurrentCursorPositionInDOMNode = (node) => {
  let range = document.getSelection().getRangeAt(0);
  range = range.cloneRange();
  range.selectNodeContents(node);
  range.setEnd(range.endContainer, range.endOffset);
  const position = range.toString().length;
  l(`stored: ${position}`);
  return position;
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

  console.log('selection:');
  const selection = window.getSelection();
  console.log(selection);

  console.log('node:');
  console.log(node.childNodes.length);

  const range = document.createRange();
  
  //range.selectNode(node.childNodes[node.childNodes.length - 1]);

  // Equivalent to:
  range.selectNodeContents(node);

  //range.setStart(node.childNodes[node.childNodes.length - 1], 0);
  //range.setEnd(node.childNodes[node.childNodes.length - 1], node.childNodes[node.childNodes.length - 1].childNodes.length);

  // Info: true = Select everything in range / false = Select nothing in range
  range.collapse(false);

  console.log('range:');
  console.log(range);

  selection.removeAllRanges();
  selection.addRange(range);

  console.log('selection:');
  console.log(selection);

};

export default underline;
export {
  CSS_CLASS_NAME,
  getCurrentCursorPositionInDOMNode,
  setCursorAtPositionInDOMNode,
};
