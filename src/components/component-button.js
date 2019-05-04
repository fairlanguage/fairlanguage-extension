import React, { Component } from 'react';

import PropTypes from 'prop-types';

import config from '../../config';
import log from '../helpers/helper-logger';

import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Montserrat', 'Roboto']
  }
});

export default class ComponentButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
    }
  }

  static get defaultProps() { 
    return { 
      caption: 'press me', 
      onClick: () => alert('you pressed me') 
    }; 
  }

  static get propTypes() { 
    return { 
      caption: PropTypes.string, 
      onClick: PropTypes.func, 
    }; 
  }

  render() {

    const { caption, onClick } = this.props;
    const { hovered } = this.state;

    return ( 
      // eslint-disable-next-line react/jsx-filename-extension
      <button
        type="button"
        style={hovered ? {
          textDecoration: 'underline',
          backgroundColor: '#FFFFFF',
          borderColor: '#000000',
          color: '#000000',
          margin: 5,
        } : {
          background: 'white',
          textDecoration: 'none',
          backgroundColor: '#000000',
          borderColor: '#000000',
          color: '#FFFFFF',
          margin: 5,
        }}
        onMouseEnter={() => {
          this.setState({ hovered: true });
        }} 
        onMouseLeave={() => this.setState({ hovered: false })} 
        onClick={onClick}
      >
        { caption }
      </button>
    )
  }

}

