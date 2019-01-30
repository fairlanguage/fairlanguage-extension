const instagram = (elementClickedOn) => {

    const con = document.getElementsByClassName('J2XYq')[0];
  
    const container = document.createElement('div');
    container.style.height = '46px';
    /* 
    container.style.height = '52px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center'; */
  
    //con.insertBefore(container, con.childNodes[1]);
  
    const textElement = elementClickedOn;
    const widgetContainer = elementClickedOn.parentNode;
  
    return [textElement, widgetContainer];
    
  }
  
  export default instagram;