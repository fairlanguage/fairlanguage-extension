import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import store from './store';

import App from './App';

import log from './helpers/helper-logger';

import { twitter } from './modules/placing/twitter';

window.onload = () => {

  // Create container element
  const containerElement = document.createElement('div');
  containerElement.id = 'fairlanguage-container';
  /*     containerElement.style.position = 'absolute';
  containerElement.style.width = '100%';
  containerElement.style.zIndex = '1';
*/

  /**
   * Detection Hacks
   */

  /*   
    twitter
  */

  /*   if (document.getElementById('tweet-box-home-timeline'))
  document.getElementById('tweet-box-home-timeline').addEventListener('focus', () => {
    document.getElementById('tweet-box-home-timeline').click()
    //document.getElementById('fl-original').focus()
    
  }); */

  if (document.getElementById('tweet-box-home-timeline')) {
    document.getElementById('tweet-box-home-timeline').addEventListener('focus', () => {
      if (document.getElementById('tweet-box-home-timeline')) {
        document.getElementById('tweet-box-home-timeline').click();
      }
    });
  }


  /*   
   facebook
  */

  if (document.querySelectorAll('textarea[name="xhpc_message"]').length > 0) {document.querySelectorAll('textarea[name="xhpc_message"]')[0].addEventListener('focus', () => {
    
    let found = false;
    const timer = setInterval(() => {
      if(found){
        return clearInterval(timer);
      };
      if( document.querySelectorAll('div[role="textbox"]') ){
        document.querySelectorAll('div[role="textbox"]')[0].click()
        found = true;
      }
    }, 50)
    
  })};
  

  /*
       setTimeout(()=>{
      document.querySelectorAll('div[role="textbox"]')[0].click()
    }, 500)
  */


  // Append container element to parent element
  // document.body.appendChild(containerElement);

  // Different approach: Take the body's pole position.
  const prependChild = (parentEle, newFirstChildEle) => {
    parentEle.insertBefore(newFirstChildEle, parentEle.firstChild);
  };

  // Prepend container element as very first element in body
  prependChild(document.body, containerElement);

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    containerElement,
  );

};
