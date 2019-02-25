import config from '../../config';

const _DEV_ = false;
const l = i => {
  if (_DEV_) return console.log(i);
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

const CLASS_NAME = 'fl-underline';

const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `.${CLASS_NAME} { border-color: ${config.colors.primary[2]}; border-bottom-width: 2.5px; border-bottom-style: solid; }`;
document.getElementsByTagName('head')[0].appendChild(style);

const createSpanElementWithUnderlinedClass = (word) => {
  const replacement = document.createElement('span');
  replacement.className = CLASS_NAME;
  replacement.innerHTML = word;
  return replacement;
};

/**
 *
 */

const underline = (word, element, cb) => {
  let found = false;
  l(`We are looking for: ${word}`);
  function iterate(current) {
    if (found) return;
    const text = current.textContent;
    // console.log(`Current DOM Node is: ${current}, with text: ${text}`);
    if (isChildlessTextNode(current) && isIncluded(word, text)) {
      // Check if its already underlined
      if (
        current.parentNode.tagName.toLowerCase() === 'span' &&
        current.parentNode.classList.contains(CLASS_NAME)
      ) return;
      // console.log(`There is a "${word}" in this: "${text}"`);

      l(`isIncluded(${word}, ${text}): ${isIncluded(word, text)}`);

      //Divide text
      const textBefore = getTextBeforeWord(word, text);
      const textAfter = getTextAfterWord(word, text);

      //l(`(${word}, "${text}") before: ${textBefore}, after: ${textAfter}`);

      //Create nodes
      const nodeBefore = textBefore ? createTextElement(textBefore) : undefined;
      const nodeUnderlined = createSpanElementWithUnderlinedClass(word);
      const nodeAfter = textAfter ? createTextElement(textAfter) : undefined;

      const nodes = [
        nodeBefore !== undefined ? nodeBefore : "",
        nodeUnderlined,
        nodeAfter !== undefined ? nodeAfter : ""
      ];

      current.replaceWith(...nodes);
      //current.parentNode.focus();
      found = true;
      if (cb !== undefined) cb();
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

function createRange(node, chars, range = document.createRange()) {
  if (!range) {
    range.selectNode(node);
    range.setStart(node, 0);
  }

  if (chars.count === 0) {
    range.setEnd(node, chars.count);
  } else if (node && chars.count > 0) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.length < chars.count) {
        chars.count -= node.textContent.length;
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

  return range;
}

const getCurrentCursorPosition = (node) => {
  let range = document.getSelection().getRangeAt(0);
  range = range.cloneRange();
  range.selectNodeContents(node);
  range.setEnd(range.endContainer, range.endOffset);
  return range.toString().length;
}

function setCurrentCursorPosition(chars, container) {
  
  l(`restored: ${chars}`);
  
  if (chars >= 0 && chars !== undefined) {
    
    const selection = window.getSelection();

    const range = createRange(container, {
      count: chars,
    });

    if (range) {
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

}

export {
  underline, createRange, getCurrentCursorPosition, setCurrentCursorPosition, 
};
