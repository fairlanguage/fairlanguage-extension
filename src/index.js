const dev = true

import React from "react";
import ReactDOM from "react-dom";

import {Provider} from 'react-redux';

import store from './store';

import App from "./App.js";

import log from './helpers/helper-logger'

window.onload = () => {

  log('* Fairlanguage 0.6 - index')

  const containerElement = document.createElement("div");
  //Append container element to parent element
  document.body.appendChild(containerElement);

  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>  
      , 
      containerElement
  );

};
