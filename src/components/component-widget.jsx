/* eslint-disable import/first */
// eslint-disable-next-line no-underscore-dangle
const __DEV__ = false;

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import axios from 'axios';

import * as actionsText from '../actions/actions-text';

import config from '../../config';

import underline, {
  getCurrentCursorPositionInDOMNode,
  setCursorAtPositionInDOMNode,
} from '../scripts/underline';

import {
  formatTextElements as formatForSlack, 
  onKeyDown as onKeyDownForSlack, 
} from '../modules/slack';

import {
  formatTextElements as formatForTwitter, 
  onKeyDown as onKeyDownForTwitter, 
} from '../modules/twitter';

import {
  formatTextElements as formatForMessenger, 
  onKeyDown as onKeyDownForMessenger, 
} from '../modules/messenger';

import {
  formatTextElements as formatForTelegram, 
  onKeyDown as onKeyDownForTelegram, 
} from '../modules/telegram';

import log from '../helpers/helper-logger';

const l = i => (__DEV__ ? log(i) : null); 

const STRING_GRADIENT = config.colors.gradient;

const mapStateToProps = state => ({
  textElements: state.textElements,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addText: actionsText.addText,
  checkText: actionsText.checkText,
}, dispatch);

let count = 0;

const addCharacterToElement = (event, element) => {
  if(event.key === 'Backspace'){
    element.innerHTML = element.innerText.slice(0, element.innerText.length-1)
  }else
  if(event.keyCode === 32){
    element.innerHTML += "\u00A0";
  }else{
    const key = event.key;

    const CONTROL_KEYS = [
      undefined,
      'undefined',
      'Control',
      'Shift',
      'Meta',
      'Alt',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
    ];

    if (CONTROL_KEYS.indexOf(key) !== -1) return;
    // element.innerHTML += String.fromCharCode((96 <= key && key <= 105) ? key-48 : key);
    element.innerHTML += key;
  }
}

const copyTextFromElementToElement = (origin, target) => {
  if (origin.nodeName === 'DIV') {
    const text = origin.innerText;
    l(text);
    target.innerText = text;
  }else{
    let text = origin.value;
    text = text.replace(new RegExp(/\s/, 'g'), '&nbsp;');
    target.innerHTML = text;
  }
  
}; 

class ComponentWidget extends Component {

  constructor(props) {

    super(props);

    this.state = {
      id: count,
      currentCursorPosition: 0,
      amount: 0,
    };

    this.textElementType = '';

    count = count + 1;

  }

  componentWillReceiveProps(props) {
    if(props.textElements[this.state.id]!==undefined&&props.textElements[this.state.id]){
      this.setState({
        amount: this.props.textElements[this.state.id].detectedWords.length
      })
    }
  }

  componentDidMount() {

    this.props.addText(this.state.id)

    const originalTextElement = this.props.textElement;

    let clonedTextElement;
    if (originalTextElement.nodeName && originalTextElement.nodeName === 'DIV') {
      clonedTextElement = originalTextElement.cloneNode(true);
    } else {
      this.textElementType = 'TEXTAREA';
      clonedTextElement = document.createElement('DIV');
    }

    // (#0000FF) [TYPING] : ORIGINAL Text Element
    originalTextElement.id = 'fl-original'; 
    originalTextElement.setAttribute('fl', 'original');

    originalTextElement.style.boxSizing = 'border-box';
    originalTextElement.style.background = 'transparent';
    originalTextElement.style.border = '0px solid rgba(0,0,255,0)';
    // originalTextElement.style.color = '#000000';
    if (__DEV__) {
      originalTextElement.style.border = '2px solid rgba(0,0,255,0.5)';
      originalTextElement.style.color = '#0000FF';
    }

    // (#FF0000) [MARKING] : CLONED Text Element
    clonedTextElement.id = 'fl-clone'; 
    clonedTextElement.setAttribute('fl', 'clone');

    clonedTextElement.style.userSelect = 'none';

    clonedTextElement.style.flexDirection = 'row';

    clonedTextElement.style.boxSizing = 'border-box';
    clonedTextElement.style.background = 'transparent';
    clonedTextElement.style.border = '0px solid rgba(0,0,255,0)';
    clonedTextElement.style.color = 'transparent';
    if (__DEV__) {
      clonedTextElement.style.border = '2px solid rgba(255,0,0,0.5)';
      clonedTextElement.style.color = '#FF0000';
    }

    originalTextElement.parentNode.insertBefore(clonedTextElement, originalTextElement);

    originalTextElement.style.position = 'absolute';

    if (__DEV__) {
      originalTextElement.style.position = 'relative';
    }

    /*
      [CUSTOM] Final Formatting
    */

    if (window.location.href.includes('twitter.com')) {
      formatForTwitter(originalTextElement, clonedTextElement);
    } else
    if (window.location.href.includes('web.telegram.org')) {
      formatForTelegram(originalTextElement, clonedTextElement);
    } else 
    if (window.location.href.includes('slack.com')) {
      formatForSlack(originalTextElement, clonedTextElement);
    } else {
      originalTextElement.style.top = '0px';
    }

    setInterval(() => {
      // l(element.textContent);
      if (clonedTextElement.textContent === '') {
        this.props.textElements[this.state.id].detectedWords = [];
        this.setState({
          amount: this.props.textElements[this.state.id].detectedWords.length
        })
      }
    }, 125);

    const keyUp = (event) => {

      l('typing...');

      // TODO: copies the whole text- better would be to add latest character
      copyTextFromElementToElement(originalTextElement, clonedTextElement);

      // TODO: Try another approach
      // addCharacterToElement(event, clonedTextElement);

      /*
        [CUSTOM] onKeyUp
      */

      if (window.location.href.includes('messenger.com')) {
        onKeyDownForMessenger(originalTextElement, clonedTextElement);
      } else 
      if (window.location.href.includes('twitter.com')) {
        onKeyDownForTwitter(originalTextElement, clonedTextElement);
      } else 
      if (window.location.href.includes('slack.com')) {
        onKeyDownForSlack(originalTextElement, clonedTextElement);
      } else 
      if (window.location.href.includes('outlook.live.com')) {
      } else {
      }
   
      // TODO: Try to get the last word only
      const text = clonedTextElement.textContent;
      l(text);

      this.props.checkText(text, this.state.id);

      const url = `https://fairlanguage-api-dev.dev-star.de/checkDocument?json&data=${encodeURI(text)}`;

      /**
       * IMPORTANT! Otherwise we use the cursor position after replacing
       */
      this.state.currentCursorPosition = getCurrentCursorPositionInDOMNode(originalTextElement);
      // l('saved:'+this.state.currentCursorPosition)

      axios
        .get(`${url}`)
        .then((response) => {
          this.setState({ amount: response.data.length });
          if (response.data.length > 0) {
            const words = response.data;
            words.forEach((word) => {
              const data = {
                word: word.string,
                suggestions: word.suggestions.option,
              };
              underline(data, clonedTextElement, 
                () => {
                  // *onMarked* 
                  // console.log('restored:'+this.state.currentCursorPosition)
                  /* setCursorAtPositionInDOMNode(this.state.currentCursorPosition, originalTextElement);  
                  originalTextElement.focus() */
                }, () => {
                  // *onReplaced* 
             
                  /**
                   * IMPORTANT! Otherwise we use the cursor position after replacing
                   */
                  copyTextFromElementToElement(clonedTextElement, originalTextElement);
                  
                  /**
                   * IMPORTANT! Copy back
                   */
                  setCursorAtPositionInDOMNode(this.state.currentCursorPosition, originalTextElement);
                  originalTextElement.focus();

                  this.props.checkText(originalTextElement.textContent, this.state.id);


                });
              /*
              *TODO:
              *  well, you know ;)
              */
            });
          }
        })
        .catch((err) => {
          l(err);
          // dispatch({type: "RECEIVE_BLOCKS_ERROR", payload: err})
        });


    };


    originalTextElement.addEventListener('focus', keyUp, true);

    clonedTextElement.parentNode.addEventListener('focus', keyUp, true);

    originalTextElement.addEventListener('keyup', keyUp, true);

    originalTextElement.parentNode.addEventListener('keyup', keyUp, true);

  }

  render() {

    const circle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: '22px',
      height: '22px',
      borderRadius: '11px',
      color: 'white',
      background: STRING_GRADIENT,
    };
    
    const circleCaption = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      
      fontSize: '14px',
      fontFamily: 'Helvetica, Lato',
      color: 'white',
      marginRight: '0px',
      marginTop: '-1px',
    };

    const { id, amount } = this.state;

    return ReactDOM.createPortal(
      <div
        id={'fairlanguage-widget-'+id}
        fl={id}
        style={{

          display: this.props.visible?'flex':'none',

          alignItems: 'center',
          justifyContent: 'flex-start',
          
          backgroundColor: 'transparent',

          border: '0px solid #c1c1c1',
      
          fontSize: '14px',
          fontWeight: '500',

          textTransform: 'uppercase',

          fontFamily: 'Roboto,arial,sans-serif',
      
          color: 'rgba(0,0,0,0.54)',
      
          textAlign: 'center',

          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={circle}>
          <div style={circleCaption}>
            {amount}
          </div>
        </div>
      </div>,
      this.props.containerElement
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentWidget);
