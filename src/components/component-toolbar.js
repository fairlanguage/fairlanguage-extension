import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import config from '../../config';

import * as actionsText from '../actions/actions-text';

import log from '../helpers/helper-logger';

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
      collapsed: false,
    };

  }

  render() {
    return (
      <div
        onClick={(event) => {
          this.setState({
            collapsed: !this.state.collapsed,
          });
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: !this.state.collapsed ? '64px' : '6px',
          backgroundColor: '#A6B3FF',
          transition: '0.5s all',
          cursor: 'pointer',
          userSelect: 'none',
          fontSize: '20px',
          color: 'white'
        }}
      >
        {!this.state.collapsed?this.props.children:null}
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
