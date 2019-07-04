/**
   * (3/3) Identify input element and position widget
   *  TODO: separate these two
   */

  let widgetContainer;
  let element;

  let buttons;

  switch (containerElementType) {

    case 'main': {
      
      
    
      if (elementClickedOn.tagName === 'DIV') {
        inputElement = elementClickedOn;
      }
    
      if (elementClickedOn.tagName === 'P') {
        inputElement = elementClickedOn.parentNode;
      }
    
      widgetContainer = element;
    
      return [inputElement, widgetContainer];

    }

    case 'editor': {
      
      element = document.createElement('button');
      element.className = 'c-button-unstyled c-texty_input__button';

      element.style.position = 'absolute';
      element.style.top = '9px';
      element.style.right = '38px';

      element.style.transform = 'scale(0.8)';
      element.style.display = 'flex';
      element.style.justifyContent = 'center';    

      // Find Buttons element
      buttons = containerElement.querySelector("div[class='c-message__editor__input_container']");
      buttons.append(element);

      if (elementClickedOn.tagName === 'DIV') {
        inputElement = elementClickedOn;
      }

      if (elementClickedOn.tagName === 'P') {
        inputElement = elementClickedOn.parentNode;
      }

      widgetContainer = element;

      return [inputElement, widgetContainer];
    
    }

    case 'threads-view': {
      
      element = document.createElement('button');
      element.className = 'c-button-unstyled c-texty_input__button';
      // element.setAttribute("tabindex", 5)

      element.style.transform = 'scale(0.8)';

      // element.style.transform = 'scale(0.8)';

      // element.style.marginRight = '25px';
      element.style.marginTop = '-0.5px';    
      // element.style.marginLeft = '5px';    
      // element.style.marginRight = '25px';
      // element.style.top = '-4px';
      element.style.display = 'flex';
      // element.style.position = 'relative';

      element.style.justifyContent = 'center';    

      // Find Buttons element
      buttons = containerElement.childNodes[containerElement.childNodes.length - 3];
      
      /* buttons.style.display = 'flex';
      buttons.style.flexDirection = 'column';
      buttons.style.alignItems = 'center';
      buttons.style.justifyContent = 'flex-end';

      buttons.style.height = '100%';
      //buttons.style.width = '100px';

      buttons.style.bottom = '6px';

      buttons.style.border = '0px solid blue'; */

      buttons.append(element);

      /*   for (const child of buttons.childNodes) {
        // child.style.position = 'relative';
      } */
      
      // return
      // .insertBefore(element, container.parentNode.querySelector('[class="ql-button"]').querySelector('[aria-label="Emoji menu"]'))

      if (elementClickedOn.tagName === 'DIV') {
        inputElement = elementClickedOn;
      }

      if (elementClickedOn.tagName === 'P') {
        inputElement = elementClickedOn.parentNode;
      }

      widgetContainer = element;

      return [inputElement, widgetContainer];
    
    }
      
    case 'threads-sidebar': {
      
      element = document.createElement('div');
      // element.className = "c-button-unstyled c-texty_input__button";
      element.setAttribute('tabindex', 5);

      element.style.transform = 'scale(0.8)';
    
      // element.style.marginRight = '25px';
      // element.style.marginTop = 'px';    
      // element.style.marginLeft = '5px';    
      element.style.marginRight = '25px';
      element.style.top = '-4px';
      element.style.display = 'flex';
      element.style.justifyContent = 'center';    
  

      // Find Buttons element
      buttons = containerElement.childNodes[containerElement.childNodes.length - 3];
      
      buttons.style.display = 'flex';
      buttons.style.flexDirection = 'row';
      buttons.style.alignItems = 'center';
      buttons.style.justifyContent = 'flex-end';

      buttons.style.height = '25px';
      buttons.style.width = '100px';

      buttons.style.border = '0px solid blue';

      buttons.append(element);
      
      // return
      // .insertBefore(element, container.parentNode.querySelector('[class="ql-button"]').querySelector('[aria-label="Emoji menu"]'))
    
      if (elementClickedOn.tagName === 'DIV') {
        inputElement = elementClickedOn;
      }
    
      if (elementClickedOn.tagName === 'P') {
        inputElement = elementClickedOn.parentNode;
      }
    
      widgetContainer = element;
    
      return [inputElement, widgetContainer];

    }

    default: {

      l(`identifyInputElement - [Slack] - Disabled on this identifiedInputElementType: ${containerElementType}`);

      return [null, null];

    }

  }