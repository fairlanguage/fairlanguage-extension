const dev = true

import config from '../config';

import React from "react";
import ReactDOM from "react-dom";

import {Provider} from 'react-redux';

import store from './store';

import App from "./App.js";

import log from './helpers/helper-logger'

window.onload = () => {

  log('* Fairlanguage 0.6 - index')

  //Create container element (@TODO: Will we actually gonna need this?!)
  const containerElement = document.createElement("div");
        containerElement.id = 'fairlanguage-container'

  //Append container element to parent element
  //document.body.appendChild(containerElement);

  //Different approach: Take the body's pole position.
  const prependChild = (parentEle, newFirstChildEle) => {
    parentEle.insertBefore(newFirstChildEle, parentEle.firstChild)
  }

  //Prepend container element as very first element in body
  prependChild(document.body, containerElement)

  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>  
      , 
      containerElement
  );
};
