
const facebook = (elementClickedOn) => {

  if(elementClickedOn.tagName === 'TEXTAREA') return;
  
    const con = document.getElementsByClassName('_16vg _1oxv')[0]

    con.style.display = 'flex';
    con.style.flexDirection = 'row';
  
    const container = document.createElement('div');
    container.style.width = '50px';
    //container.style.height = '44px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
  
    //con.appendChild(container);
  
    con.insertBefore(container, con.childNodes[0]);
  
    const textElement = elementClickedOn;
    const widgetContainer = container;
  
    return [textElement, widgetContainer];
  

  
}

export default facebook;