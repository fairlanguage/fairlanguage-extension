const slack = (elementClickedOn) => {

  const element = document.getElementsByClassName('btn_unstyle msg_mentions_button')[0];
  const container = document.createElement('div');
  container.style.marginLeft = '-28px';
  container.style.marginTop = '-2px';    

  element.prepend(container);

  const textElement = elementClickedOn;
  const widgetContainer = container;

  return [textElement, widgetContainer]

}

export default slack;