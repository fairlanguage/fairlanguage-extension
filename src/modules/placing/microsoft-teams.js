const meet = (elementClickedOn) => {

    const con = document.getElementsByClassName('extension-sub-icons compose-stripe')[0];
  
    const container = document.createElement('div');
    
    container.style.width = '32px';
    container.style.height = '32px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
  
    con.insertBefore(container, con.childNodes[0]);
  
    const textElement = elementClickedOn;
    const widgetContainer = container;
  
    return [textElement, widgetContainer];
    
  }
  
  export default meet;

