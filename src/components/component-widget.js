import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionsText from '../actions/actions-text';

import config from '../../config';

import log from '../helpers/helper-logger';

import underline, {
  getCurrentCursorPositionInDOMNode,
  setCursorAtPositionInDOMNode,
} from '../scripts/underline';

const axios = require('axios');

const __DEV__ = false;

const l = (i) => {
  if(__DEV__) 
    return log(i);
}

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
      id: count,
      currentCursorPosition: 0,
      amount: 0,
      text: '',
    };

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

    const element = this.props.textElement;
    console.log(element);

    setInterval(() => {
      // l(element.textContent);
      if (element.textContent === '') {
        this.props.textElements[this.state.id].detectedWords = [];
        this.setState({
          amount: this.props.textElements[this.state.id].detectedWords.length
        })
      }
    },125)

    element.addEventListener('keydown', (event) => {
      //event.preventDefault();
    })

    element.addEventListener('keyup', (event) => {
      //event.preventDefault();
    })

    element.addEventListener('input', (event) => {

      console.log(event)

      const text = element.textContent;
      //console.log(text);

      this.props.checkText(text, this.state.id);

      const url = `https://fairlanguage-api-dev.dev-star.de/checkDocument?json&data=${encodeURI(
        text,
      )}`;

      // [DEPRECATED at this state of ev, might be helpful in the future] Save prev cursor position
      this.state.currentCursorPosition = getCurrentCursorPositionInDOMNode(element);
      //console.log('saved:'+this.state.currentCursorPosition)

      if (
        event.data === ' ' // Space
       /*  || event.keyCode === 8 // Backslash
        || event.keyCode === 49 // !
        || event.keyCode === 219 // ?
        || event.keyCode === 188 // , (Comma)
        || event.keyCode === 190 // . (Point) */
      ) {

        axios
          .get(`${url}`)
          .then((response) => {
            this.setState({ amount: response.data.length });
            if (response.data.length > 0) {
              const words = response.data;
              words.forEach((word) => {
                const data = {
                  word: word.string,
                  suggestions: word.suggestions.option
                };
                underline(data, element, 
                  () => {
                  //console.log('restored:'+this.state.currentCursorPosition)
                  setCursorAtPositionInDOMNode(this.state.currentCursorPosition, element);  
                }, () => {
                  this.props.checkText(element.textContent, this.state.id);
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
        
      }

    })

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
