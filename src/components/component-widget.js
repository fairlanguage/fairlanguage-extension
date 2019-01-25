
import config from '../../config';

import React, { Component } from "react";
import ReactDOM from "react-dom";

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as actionsText from '../actions/actions-text';

import log from '../helpers/helper-logger'

const STRING_GRADIENT = config.colors.gradient;

const URL_ICON_ON = 'https://a.icons8.com/MVhZihaX/ebBhTF/oval.png';
const URL_ICON_OFF = 'https://a.icons8.com/MVhZihaX/0yohoZ/oval.png';

const mapStateToProps = (state) => {

  return {
    textElements: state.textElements
  };

}

const mapDispatchToProps = (dispatch) => {

  return bindActionCreators({

    addText: actionsText.addText,
    checkText: actionsText.checkText

  }, dispatch);

}

let count = 0

class ComponentWidget extends Component {

  constructor() {

    super();

    this.state = {
      id: count++,
      text: '_',
      height: '',
      amount: 0
    }

  }

  get amount(){
    return this.props&&this.props.textElements&&this.props.textElements[this.state.id]?this.props.textElements[this.state.id].detectedWords.length:0
  }

  componentDidMount(){

    //Add to global state
    this.props.addText(this.state.id)


    let compStyles = window.getComputedStyle(this.props.textElement);

    this.setState({
      height:compStyles.getPropertyValue('height')
    })

    //Listen to keyboard

    function keyDown(e) {console.log(e.which);}; // Test

    const keyUp = (event) => {

      let text;

      //const text1 = this.props.textElement.childNodes?this.props.textElement.childNodes[0].innerHTML:'';
      const text2 = this.props.textElement.innerHTML;
      const text3 = this.props.textElement.textContent;
      const text4 = this.props.textElement.value;

      //log(text1)
      log(text2)
      log(text3)
      log(text4)

      text = text3;

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
          display: 'flex',

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

          position: 'absolute',
          top: this.state.height,
          marginTop: '-22px',

          //transform: `translate(5px, calc(${this.state.height} - 0px)`,
      
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={circle}>
          <div style={circleCaption}>
            {
              this.amount
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
