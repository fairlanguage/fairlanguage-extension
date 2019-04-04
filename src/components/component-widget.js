import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import axios from 'axios';

import * as actionsText from '../actions/actions-text';

import config from '../../config';

import log from '../helpers/helper-logger';

import underline, {
  getCurrentCursorPositionInDOMNode,
  setCursorAtPositionInDOMNode,
} from '../scripts/underline';

import formatForGoogleMail from '../modules/textElements/google-mail';
import formatForTwitter from '../modules/textElements/twitter';
import formatForOutlook from '../modules/textElements/outlook';

import onKeyDownForTwitter from '../modules/onKeyDown/twitter';

const __DEV__ = true;

const l = (i) => {
  if (__DEV__) {
    return log(i);
  } 
  return null;
};

const STRING_GRADIENT = config.colors.gradient;

const mapStateToProps = state => ({
  textElements: state.textElements,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addText: actionsText.addText,
  checkText: actionsText.checkText,
}, dispatch);

let count = 0;

const copyTextFromElementToElement = (origin, target) => {
  if (origin.nodeName === 'DIV') {
    target.innerText = origin.innerText;
  }else{
    target.innerText = origin.value;
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

    this.textElementType = ''

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
    if (originalTextElement.nodeName === 'DIV') {
      clonedTextElement = originalTextElement.cloneNode(true);
    }else{
      this.textElementType = 'TEXTAREA';
      clonedTextElement = document.createElement('DIV');
      //clonedTextElement.style.cssText = document.defaultView.getComputedStyle(originalTextElement, "").cssText;
    }


    // (#0000FF) [TYPING] : ORIGINAL Text Element
    originalTextElement.id = 'fl-original'; 
    originalTextElement.setAttribute('fl', 'original');

    originalTextElement.style.boxSizing = 'border-box';
    originalTextElement.style.background = 'transparent';
    originalTextElement.style.border = '0px solid rgba(0,0,255,0)';
    originalTextElement.style.color = '#000000';
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

    originalTextElement.style.position = 'absolut';

    if (__DEV__) {
      originalTextElement.style.position = 'relative';
    }
    originalTextElement.parentNode.style.flexDirection = 'column';
    originalTextElement.style.left = '0';

    originalTextElement.style.zIndex = '1';
    clonedTextElement.style.zIndex = '0'; 

    /*
      [CUSTOM] Final Formatting
    */

    if (window.location.href.includes('mail.google.com')) {
      formatForGoogleMail(originalTextElement, clonedTextElement);
    } else 
    if (window.location.href.includes('twitter.com')) {
      formatForTwitter(originalTextElement, clonedTextElement);
    } else 
    if (window.location.href.includes('outlook.live.com')) {
      formatForOutlook(originalTextElement, clonedTextElement);
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

      if (window.location.href.includes('mail.google.com')) {
      } else 
      if (window.location.href.includes('twitter.com')) {
        onKeyDownForTwitter(originalTextElement, clonedTextElement);
      } else 
      if (window.location.href.includes('outlook.live.com')) {
      } else {
      }

      copyTextFromElementToElement(originalTextElement, clonedTextElement)
      
      const text = clonedTextElement.textContent;
      l(text)

      this.props.checkText(text, this.state.id);

      const url = `https://fairlanguage-api-dev.dev-star.de/checkDocument?json&data=${encodeURI(text)}`;

      // [DEPRECATED] at this state of ev, might be helpful in the future] Save prev cursor position
      this.state.currentCursorPosition = getCurrentCursorPositionInDOMNode(originalTextElement);
      // console.log('saved:'+this.state.currentCursorPosition)

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
          //dispatch({type: "RECEIVE_BLOCKS_ERROR", payload: err})
        });


    };

    originalTextElement.addEventListener('keyup', keyUp, true);

    originalTextElement.addEventListener('focus', keyUp, true);

    //originalTextElement.addEventListener('click', keyUp, true);

    //originalTextElement.parentNode.addEventListener('click', keyUp, true);

    clonedTextElement.parentNode.addEventListener('focus', keyUp, true);

  }

  render() {

    return ReactDOM.createPortal(
      <div
        
        id={'fairlanguage-widget-'+this.state.id}
        fl={this.state.id}
        style={{

          display: this.props.visible?'flex':'none',

          alignItems: 'center',
          justifyContent: 'flex-start',
          
          backgroundColor: 'transparent',

          //borderRadius: '12.5px',
          border: '0px solid #c1c1c1',
      
          fontSize: '14px',
          fontWeight: '500',
          //lineHeight: '48px',

          textTransform: 'uppercase',

          fontFamily: 'Roboto,arial,sans-serif',
      
          color: 'rgba(0,0,0,0.54)',
      
          textAlign: 'center',

          //marginLeft: '14px',

          //position: 'absolute',
          //top: this.state.height,
          //marginTop: '-22px',

          //transform: `translate(5px, calc(${this.state.height} - 0px)`,
      
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={circle}>
          <div style={circleCaption}>
            {
              this.state.amount
            }
          </div>
        </div>
      </div>,
      this.props.containerElement
    )
    
  }
}

const circle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '22px',
  height: '22px',
  borderRadius: '11px',
  color: 'white',

  background: STRING_GRADIENT
}

const circleCaption = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  
  fontSize: '14px',
  fontFamily: 'Helvetica, Lato',
  color: 'white',
  //fontWeight: 'bold',
  marginRight:'0px',
  marginTop:'-1px',

  //background: 'linear-gradient(to bottom, #4abae2 0%,#db02db 100%)'
}

const logo = {
    width: '22px',
    height: '22px',
    marginRight: '11px'
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComponentWidget);
