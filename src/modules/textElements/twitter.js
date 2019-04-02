const formatTextElements = (originalTextElement, clonedTextElement) => {
  originalTextElement.style.top = '0px';

  clonedTextElement.addEventListener('click', () => {
    originalTextElement.focus();
  });
  
  clonedTextElement.addEventListener('focus', () => {
    originalTextElement.focus();
  });

  originalTextElement.setAttribute('data-placeholder-default', '');
  clonedTextElement.setAttribute('data-placeholder-default', '');

  originalTextElement.setAttribute('data-placeholder-reply', '');
  clonedTextElement.setAttribute('data-placeholder-reply', '');
}
export default formatTextElements;