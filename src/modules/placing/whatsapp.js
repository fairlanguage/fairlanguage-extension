const whatsapp = (elementClickedOn) => {

  const con = document.getElementsByClassName('_3pkkz copyable-area')[0];

  const container = document.createElement('div');
  container.style.width = '46px';
  container.style.height = '52px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  con.insertBefore(container, con.childNodes[1]);

  const textElement = elementClickedOn;
  const widgetContainer = container;

  return [textElement, widgetContainer];
  
}

export default whatsapp;