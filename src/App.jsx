/* eslint-disable import/first */
// eslint-disable-next-line no-underscore-dangle
const __DEV__ = false;

import React, { Fragment, Component } from 'react';

import ComponentToolbar from './components/component-toolbar';
import ComponentWidget from './components/component-widget';

import validateInputElement from './scripts/validateInputElement';

import customIdentifierSlack from './modules/slack';
import customIdentifierTwitter from './modules/twitter';
import customIdentifierTelegram from './modules/telegram';
import customIdentifierMessenger from './modules/messenger';

import StorageController from './controller/storage';

import Button from 'react-bootstrap/Button';
// import Button from './components/component-button';

import './index.css';

import * as manifest from '../manifest.json';

import log from './helpers/helper-logger';

const l = i => (__DEV__ ? log(i) : null); 

const TEXT_PROMPT_ENABLE = 'Um dir Feedback und Empfehlungen zu deinen Texten geben zu können, müssen wir diese an einen Server senden und dort analysieren. Mit der Nutzung unserer Extension stimmst du der Verarbeitung deiner Daten und unserer Datenschutzerklärung (zu finden unter: https://www.fairlanguage.com/impressum) ausdrücklich zu.';
const TEXT_ENABLE = 'Ja, damit bin ich einverstanden.';
const TEXT_DISABLE = 'Nein, ich bin nicht einverstanden.';

/**
 * I am flamingo.
 */

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputElements: [],
    };
  }

  componentWillMount() {

    log(`${manifest.version} initialising...`);

    const localStorage = [
      StorageController.getSettings(), 
      StorageController.getHostSettings(),
    ];

    Promise.all(localStorage)
      .then((results) => {
        const generalSettings = results[0];
        const hostSettings = results[1];
        this.setState({
          enabled: generalSettings.enabled,
          hostEnabled: hostSettings.enabled,
          toolbar: generalSettings.consent === false ? true : generalSettings.toolbar,
        }, () => {
          l(this.state);
        });
      });

  }

  componentDidMount() {
    
    /*
    * Just gimme ONE call - they'll all be gone.
    */

    chrome.runtime.sendMessage({ host: { name: window.location.host } });

    chrome.runtime.onMessage.addListener(
      (message, sender) => {
        log(JSON.stringify(message));
        switch (message.command) {
          case 'enabled':
            StorageController.setEnabled()
              .then((settings) => {
                this.setState({ enabled: settings.enabled });
                chrome.runtime.sendMessage({ settings });
              });

            break;
          case 'toolbar':
            StorageController.setToolbar()
              .then((state) => {
                this.setState({ toolbar: state });
                chrome.runtime.sendMessage({ toolbar: state });
              });

            break;
          case 'consent':
        
            StorageController.setConsent()
              .then((state) => {
                this.setState({ consent: state });
                chrome.runtime.sendMessage({ consent: state });
              });

            break;
          case 'host-enable':
            
            StorageController.setHost(true)
              .then((settings) => {
                this.setState({ host: settings.enabled });
                chrome.runtime.sendMessage({ host: settings });
              });

            break;
          case 'host-disable':
          
            StorageController.setHost(false)
              .then((settings) => {
                this.setState({ host: settings.enabled });
                chrome.runtime.sendMessage({ host: settings });
              });

            // TODO: NOT GOOD!!! Delete clones

            const elements = document.querySelectorAll('[id=fl-clone]');
            for (const el of elements) {
              if (el && el.style) { el.style.opacity = 0; }
            }

            break;

          default:
            log('Fairlanguage');
            break;
        }
      },
    );

    window.addEventListener('focus', (event) => {
      this.identifyInputElement(event);
    });

    window.addEventListener('click', (event) => {
      this.identifyInputElement(event);
    });

    window.addEventListener('keydown', (event) => {
      this.identifyInputElement(event);
    });

  }

  getOverallState() {

    const { enabled, hostEnabled } = this.state;

    // Disabled for current host?
    if (hostEnabled === false) return false;

    // Otherwise use general state
    return enabled;

  }

  identifyInputElement(event) {

    /*
    * That shit on? Are we actually allowed in here?
    */
    const enabled = this.getOverallState();
    if (!enabled) return l('Extension disabled');

    /*
    * So, what do we have?
    */
    const elementClickedOn = event.target;

    // Validate potential inputElement
    const isPotentialInputElement = validateInputElement(elementClickedOn);
    if (!isPotentialInputElement) return l(`isPotentialInputElement: ${isPotentialInputElement}`);

    /*
    *  Identify inputElement, position widget
    */

    let inputElement;
    let widgetContainer;

    /**
     * Custom identifier/positioner
     */
    
    let customIdentifier;
    if (window.location.href.includes('slack.com')) {

      customIdentifier = 'Slack';
      l(`hasCustomIdentifier: ${customIdentifier}`);

      const elements = customIdentifierSlack(elementClickedOn);
      
      [inputElement, widgetContainer] = elements;
    } else
    if (window.location.href.includes('messenger.com')) {

      customIdentifier = 'Messenger';
      l(`hasCustomIdentifier: ${customIdentifier}`);

      const elements = customIdentifierMessenger(elementClickedOn);
      
      [inputElement, widgetContainer] = elements;

    } else
    if (window.location.href.includes('twitter.com')) {

      customIdentifier = 'Twitter';
      l(`hasCustomIdentifier: ${customIdentifier}`);

      const elements = customIdentifierTwitter(elementClickedOn);
      
      [inputElement, widgetContainer] = elements;

    } else
    if (window.location.href.includes('telegram.org')) {

      customIdentifier = 'Telegram';
      l(`hasCustomIdentifier: ${customIdentifier}`);

      const elements = customIdentifierTelegram(elementClickedOn);
      
      [inputElement, widgetContainer] = elements;

    } else {

      /**
       * Default identifier/positioner
       */

      inputElement = elementClickedOn;
      widgetContainer = elementClickedOn.parentNode;

    }

    /**
    * If the textElement was set to null by the customModule it is not supposed
    * to be enabled on the identified textElement.
    */

    if (customIdentifier && inputElement === null) {
      return l('customIdentifier: disabled on this element');
    }

    const { inputElements } = this.state;

    inputElements.push([inputElement, widgetContainer]);

    this.setState({
      inputElements,
    });

    /*
    * Mark the element, so we wont give it a widget again.
    * TODO: Move to identifier
    */

    inputElement.setAttribute('fl', inputElements.length);

    return l(`Sucessfully identified inputElement and set widget #${inputElements.length}`);
  }

  handleClickEnabled(mode) {
    StorageController.setEnabled(mode)
      .then(() => {
        this.setState({
          enabled: mode,
        });
      });
  }

  _handleSetActive() {
    this.setState({
      active: !this.state.active,
    });
  }

  render() {

    const enabled = this.getOverallState();

    return (
      <Fragment>
        {
          true 
          
            ? (
              <ComponentToolbar
                open={this.state.enabled === null}
              >
                <div
                  style={{
                    margin: '25px',
                  }}
                >
                  <div style={{ 
                    fontSize: '20px', 
                    marginBottom: '8px',
                    lineHeight: '24px', 
                  }}
                  >
                    {TEXT_PROMPT_ENABLE}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <Button
                      variant="primary"      
                      onClick={() => this.handleClickEnabled(true)}
                    >{TEXT_ENABLE}</Button>
                    <Button
                      variant="primary"
                      onClick={() => this.handleClickEnabled(false)}
                    >{TEXT_DISABLE}</Button>
                  </div>
                </div>

              </ComponentToolbar>
            )
            : null
        }
        {
          enabled
            ? this.state.inputElements.map((el, index) => (
              <ComponentWidget
                key={index}
                visible
                textElement={el[0]}
                containerElement={el[1]}
              />
            ))
            : null
        }
      </Fragment>
    );
  }
}
