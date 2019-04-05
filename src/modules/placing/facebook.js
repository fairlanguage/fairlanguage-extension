const facebook = (elementClickedOn) => {

  const con = document.getElementsByClassName('notranslate _5rpu')[0]

  con.style.display = 'flex';
  con.style.flexDirection = 'row';

  const container = document.createElement('div');
  container.style.width = '50px';
  container.style.height = '44px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  con.parentNode.insertBefore(container, con.nextSibling);

  //con.insertBefore(container, con.childNodes[0]);

  const textElement = elementClickedOn;
  const widgetContainer = container;

  return [textElement, widgetContainer];
}

export default facebook;