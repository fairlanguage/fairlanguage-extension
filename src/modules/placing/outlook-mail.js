const outlook = (elementClickedOn) => {

  const con = document.querySelectorAll('div[class="ms-OverflowSet-item item-60"]')[7].parentNode

  const container = document.createElement('div');

  container.style.marginLeft = '12px';
  container.style.marginRight = '12px';
  container.style.marginTop = '-4px';

  //container.style.height = '44px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  //con.appendChild(container)

  con.insertBefore(container, con.childNodes[0]);

  const textElement = elementClickedOn;
  const widgetContainer = container;

  return [textElement, widgetContainer];
}

export default outlook;