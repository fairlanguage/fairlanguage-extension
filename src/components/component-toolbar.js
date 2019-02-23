import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import config from '../../config';

import * as actionsText from '../actions/actions-text';

import log from '../helpers/helper-logger';

import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Montserrat', 'Roboto']
  }
});

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

class ComponentToolbar extends Component {

  constructor() {

    super();

    this.state = {
      open: false,
    };

  }

  componentWillMount(){
    this.setState({
      open: this.props.open
    })
  }

  componentWillReceiveProps(props){
    this.setState({
      open:props.open
    })
  }

  render() {
    return (
      <div
      onClick={(event) => {
        //if(!this.state.open)
        this.setState({
          open: !this.state.open,
        });
      }}
      style={{
        position: "sticky",
        zIndex: 999999999999999999999,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: this.state.open ? config.toolbar.height : '5px',
        backgroundColor: config.colors.primary[0],
        transition: '0.5s all',
        cursor: 'pointer',
        userSelect: 'none',
        fontSize: '16px',
        fontFamily: 'Arial',
        fontWeight: '300',
        color: 'white',
        top: 0,
        opacity:config.toolbar.opacity,
      }}
      >
        <div
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex:1000000000
          }}
        >
          {this.state.open?this.props.children:null}
        </div>

        <img
        onClick={(event) => {
          this.setState({
            open: !this.state.open,
          });
        }}
          style={{
            position: 'absolute',
            top: '25px',
            right: '25px',
            width: '17.5px',
            height: '17.5px',
            display: this.state.open?'flex':'none'
          }}
          src={chrome.extension.getURL("close.png")}
        >
        </img>
        
      </div>
    );

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
};


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentToolbar);
