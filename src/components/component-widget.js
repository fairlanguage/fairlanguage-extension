import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionsText from '../actions/actions-text';

import config from '../../config';

import log from '../helpers/helper-logger';

import { underline, setCurrentCursorPosition, getCurrentCursorPosition } from '../scripts/underline';

const axios = require('axios');

const STRING_GRADIENT = config.colors.gradient;

const URL_ICON_ON = 'https://a.icons8.com/MVhZihaX/ebBhTF/oval.png';
const URL_ICON_OFF = 'https://a.icons8.com/MVhZihaX/0yohoZ/oval.png';

const mapStateToProps = state => ({
  textElements: state.textElements,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addText: actionsText.addText,
  checkText: actionsText.checkText,
}, dispatch);

let count = 0;

class ComponentWidget extends Component {

  constructor(props) {

    super(props);

    this.state = {
      id: count += 1,
      currentCursorPosition: 0,
      amount: 0,
    };

  }

  get amount() {
    const res = this.props&&this.props.textElements&&this.props.textElements[this.state.id]?this.props.textElements[this.state.id].detectedWords.length:0
    console.log(res)
    return res;
  }

  componentDidMount() {

    // Add to global state
    this.props.addText(this.state.id)

    let compStyles = window.getComputedStyle(this.props.textElement);

    this.setState({
      height:compStyles.getPropertyValue('height')
    })

    const keyDown = e => console.log(e.which); // Test

    const keyUp = (event) => {

      const textContent = this.props.textElement.textContent;
      const value = this.props.textElement.value;

      log(textContent);
      log(value);

      const text = textContent != undefined && textContent != null && textContent != '' ? textContent : (value != undefined && value != null && value != '' ? value : '');

      const url = `https://fairlanguage-api-dev.dev-star.de/checkDocument?json&data=${encodeURI(
        text
      )}`;

      const container = this.props.textElement;

      if (
        event.keyCode === 32 // Space
        || event.keyCode === 8 // Backslash
        || event.keyCode === 188 // ,
        || event.keyCode === 190 // .
      ) {

        // Save prev cursor position
        this.state.currentCursorPosition = getCurrentCursorPosition(container);
  
        //console.log(range.toString());
        //console.log(`saved: ${saved}`);

        axios
          .get(`${url}`)
          .then((response) => {
            this.setState({ amount: response.data.length });
            if (response.data.length > 0) {
              const words = response.data;
              words.forEach((word) => {
                underline(word.string, container, () => {
                  setCurrentCursorPosition(this.state.currentCursorPosition, container);
                });
              });
            }
          })
          .catch((err) => {
            //dispatch({type: "RECEIVE_BLOCKS_ERROR", payload: err})
          });
        
      }

      this.props.checkText(text, this.state.id);

    }; 
   
    (function checkForNewIframe(doc) {
        if (!doc) return; // document does not exist. Cya

        // Note: It is important to use "true", to bind events to the capturing
        // phase. If omitted or set to false, the event listener will be bound
        // to the bubbling phase, where the event is not visible any more when
        // Gmail calls event.stopPropagation().
        // Calling addEventListener with the same arguments multiple times bind
        // the listener only once, so we don't have to set a guard for that.
        doc.addEventListener('keydown', keyDown, true);
        doc.addEventListener('keyup', keyUp, true);
        doc.hasSeenDocument = true;
        for (var i = 0, contentDocument; i<frames.length; i++) {
            try {
                contentDocument = iframes[i].document;
            } catch (e) {
                continue; // Same-origin policy violation?
            }
            if (contentDocument && !contentDocument.hasSeenDocument) {
                // Add poller to the new iframe
                checkForNewIframe(iframes[i].contentDocument);
            }
        }
        setTimeout(checkForNewIframe, 250) // <-- delay of 1/4 second
    })(document); // Initiate recursive function for the document.

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
