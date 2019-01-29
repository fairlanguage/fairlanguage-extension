const zalando = (elementClickedOn) => {
  
  const con = document.getElementsByClassName('z-icon z-icon-search-semi-bold z-icon-small z-icon-black')[0];

  const container = document.createElement('div');
  
  container.style.width = '26px';
  container.style.height = '26px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  con.style.display = 'flex';
  con.style.border = '0px solid red';

  con.style.flexDirection = 'row';
  con.style.alignItems = 'center';
  con.style.justifyContent = 'center';

  con.style.width = '52px'

  con.insertBefore(container, con.childNodes[0]);

  const textElement = elementClickedOn;
  const widgetContainer = container;

  return [textElement, widgetContainer]

}

export default zalando;