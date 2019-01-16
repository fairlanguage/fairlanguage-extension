
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

class ComponentToolbar extends Component {

  constructor() {

    super();

    this.state = {
        collapsed: false
    }

  }

  render() {
    return(
      <div
        onClick={(event) => {
            this.setState({
                collapsed: !this.state.collapsed
            })
        }}
        style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: this.state.collapsed?'64px':'6px',
            background: config.colors.primary,
            transition:'0.5s all',
            cursor:'pointer'
        }}
      >
        <img src={chrome.extension.getURL("icon-off.png")}
            style={{
                marginLeft: '16px',
                width:'32px',
                height:'32px',
                background: config.colors.primary,
                display: this.state.collapsed?'flex':'none'
            }}
        >
        </img>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                width:'32px',
                height:'32px',
                borderRadius: '16px',
                color: config.colors.primary,
                background: 'white',
                fontWeight: 'bold',
                fontSize: '20',
                display: this.state.collapsed?'flex':'none'
            }}
        >
            {this.props.textElements.length}
        </div>
      </div>
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
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComponentToolbar);
