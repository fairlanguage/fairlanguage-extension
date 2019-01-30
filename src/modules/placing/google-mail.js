const googleMail = (elementClickedOn) => {

  const con = document.getElementsByClassName('btC')[0];

  const container = document.createElement('div');

  container.style.marginLeft = '12px';
  //container.style.height = '44px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  //con.appendChild(container)

  con.insertBefore(container, con.childNodes[1]);

  const textElement = elementClickedOn;
  const widgetContainer = container;

  return [textElement, widgetContainer];
}

export default googleMail;