const google = (elementClickedOn) => {

  const con = document.getElementsByClassName('dRYYxd')[0];

  const container = document.createElement('li');
  container.style.width = '50px';
  container.style.height = '44px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  con.insertBefore(container, con.childNodes[2]);

  const textElement = elementClickedOn;
  const widgetContainer = container;

  return [textElement, widgetContainer];
}

export default google;