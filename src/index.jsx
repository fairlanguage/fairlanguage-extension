import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import store from './store';

import App from './App';

import log from './helpers/helper-logger';

  window.onload = () => {

    // Create container element
    const containerElement = document.createElement('div');
    containerElement.id = 'fairlanguage-container';
/*     containerElement.style.position = 'absolute';
    containerElement.style.width = '100%';
    containerElement.style.zIndex = '1';
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

