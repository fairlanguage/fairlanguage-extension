const onKeyDown = (originalTextElement, clonedTextElement) => {
  clonedTextElement.setAttribute('data-placeholder-default', '');
  clonedTextElement.setAttribute('data-placeholder-reply', '');

  originalTextElement.setAttribute('data-placeholder-default', '');
  originalTextElement.setAttribute('data-placeholder-reply', '');
}

export default onKeyDown;