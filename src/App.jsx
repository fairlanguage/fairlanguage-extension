import React, { Fragment, Component } from 'react';

import hosts from '../hosts';

import log from './helpers/helper-logger';

import ComponentToolbar from './components/component-toolbar';
import ComponentWidget from './components/component-widget';

import ModulePlacingSlack from './modules/slack';

import ModulePlacingGoogleMail from './modules/placing/google-mail';
import ModulePlacingYahooMail from './modules/placing/yahoo-mail';
import ModulePlacingOutlookMail from './modules/placing/outlook-mail';

import ModulePlacingGoogleMeet from './modules/placing/google-meet';
import ModulePlacingMicrosoftTeams from './modules/placing/microsoft-teams';

import ModulePlacingMessenger from './modules/placing/messenger';
import ModulePlacingWhatsapp from './modules/placing/whatsapp';
import ModulePlacingTelegram from './modules/placing/telegram';

import ModulePlacingFacebook from './modules/placing/facebook';
import ModulePlacingTwitter from './modules/placing/twitter';
import ModulePlacingInstagram from './modules/placing/instagram';

import ModulePlacingZalando from './modules/placing/zalando';

import StorageController from './controller/storage';

import Button from './components/component-button';

import './index.css';

import * as manifest from '../manifest.json';

const dev = true;

const TEXT_PROMPT_ENABLE = 'Toll, dass du Fairlanguage verwenden möchtest! Bitte lies unsere Nutzungsbedingungen, um die Extension zu aktivieren.';
const TEXT_ENABLE = 'Ja, damit bin ich einverstanden.';
const TEXT_DISABLE = 'Nein, ich bin nicht einverstanden.';

/**
 * I am flamingo.
 */

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      textFields: [],
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
          if (dev)console.log(this.state);
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
                chrome.runtime.sendMessage({ settings: settings });
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

            // Delete clones

            const elements = document.querySelectorAll('[id=fl-clone]');
            for (const el of elements){
              if(el && el.style)
              el.style.opacity = 0;
            }

            break;

          default:
            log('Ain`t got nothing to say(it`s just language).');
            break;
        }
      },
    );

    window.addEventListener('click', (event) => {

      /*
      * Are we live? That shit on?
      * Are we actually allowed in here?
      */
      const enabled = this.getOverallState();

      if (dev) console.log(this.state);
      if (!enabled) return log('Extension disabled');
      
      /*
      * So, Where did this actually go?
      */
      const elementClickedOn = event.target;

      /*
      *  First, check if it's ours.
      */
      let isAlreadyInjected = false;

      let maxDepth = 10;
      let depth = 0;
      let el = elementClickedOn;
      while (!isAlreadyInjected && depth <= maxDepth) {
        if (el !== document && el !== document.body && el !== null) {
          isAlreadyInjected = el.hasAttribute('fl');
          el = el.parentNode !== null ? el.parentNode : el;
        }
        depth += 1;
      }

      log(`isAlreadyInjected: ${isAlreadyInjected}`);

      if (isAlreadyInjected) return;

      /*
      *  Second, detect if the element is any kind of text field.
      */

      // Is the element itself a HTML TextArea element?
      const isTextArea = elementClickedOn.type === 'textarea';
      log(`isTextArea: ${isTextArea}`);

      // Is the element an input element?
      const isIn = elementClickedOn.tagName.toLowerCase() === 'input';
      log(`isIn: ${isIn}`);

      // Is the element's type input?
      const isInput = elementClickedOn.type === 'input';
      log(`isInput: ${isInput}`);

      // Is the element's type search?
      const isSearch = elementClickedOn.type === 'search';
      log(`isSearch: ${isSearch}`);

      // Is the element itself content editable?
      const isContentEditable = elementClickedOn.hasAttribute('contenteditable');
      log(`isContentIsEditable: ${isContentEditable}`);

      // Is a parent element's content editable?
      let isParentElementContentIsEditable;

      maxDepth = 10;

      depth = 0;
      el = elementClickedOn;
      while (!isParentElementContentIsEditable && depth <= maxDepth) {
        if (el !== document && el !== document.body && el !== null) {
          isParentElementContentIsEditable = el.hasAttribute('contenteditable');
          el = el.parentNode !== null ? el.parentNode : el;
        }
        depth += 1;
      }

      log(`isParentElementContentIsEditable (${depth}): ${isParentElementContentIsEditable}`);

      /**
       * Decide, according to what wr got.
       */

      // If none of that is the case it just wasn't a txt field (sorry :/).
      // if (isInput || isIn || isTextArea) return;
      if (!isTextArea && !isSearch && !isContentEditable && !isParentElementContentIsEditable) return;

      /*
      *  Third, we decide where to place the fucking widget!
      */

      const { textFields } = this.state;

      let textElement;
      let widgetContainer;

      // Do we have a custom idea for the webapp?
      let hasCustomPosition = false;
      if (window.location.href.includes('slack.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingSlack(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else
      if (window.location.href.includes('twitter.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingTwitter(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else
      if (window.location.href.includes('outlook.live.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingOutlookMail(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else
      if (window.location.href.includes('mail.yahoo.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingYahooMail(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else  
      if (window.location.href.includes('mail.google.com')) {
        hasCustomPosition = true;

        const e = ModulePlacingGoogleMail(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else
      if (window.location.href.includes('facebook.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingFacebook(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else       
      if (window.location.href.includes('en.zalando.de')) {

        hasCustomPosition = true;

        const e = ModulePlacingZalando(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else     
      if (window.location.href.includes('messenger.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingMessenger(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else     
      if (window.location.href.includes('meet.google.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingGoogleMeet(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else    
      if (window.location.href.includes('instagram.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingInstagram(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else 
      if (window.location.href.includes('teams.microsoft.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingMicrosoftTeams(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else    
      if (window.location.href.includes('whatsapp.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingWhatsapp(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else      
      if (window.location.href.includes('telegram.org')) {

        hasCustomPosition = true;

        const e = ModulePlacingTelegram(elementClickedOn);
        textElement = e[0];
        widgetContainer = e[1];

      } else {

        /*
      * We don't have a custom position for this app, so just place it inside the parent node.
      */

        const parentElement = isParentElementContentIsEditable ? elementClickedOn.parentNode.parentNode : elementClickedOn.parentNode;
        
        textElement = elementClickedOn;
        widgetContainer = parentElement;

      }

      log(`hasCustomPosition (MODULE): ${hasCustomPosition}`);

      textFields.push([textElement, widgetContainer]);

      this.setState({
        textFields,
      });

      /*
      * Mark the element, so we wont give it a widget again.
      */

      elementClickedOn.setAttribute('fl', 'lala');
      elementClickedOn.parentElement.setAttribute('fl', 'lala');

      log(`Set widget #${textFields.length}`);

    });

  }

  getOverallState() {

    // Disabled for current host?
    if (this.state.hostEnabled === false) return false;

    // Otherwise use general state
    return this.state.enabled;

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
                open={this.state.enabled === null ? true : false}
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
                      caption={TEXT_ENABLE}
                      onClick={() => this.handleClickEnabled(true)}
                    />
                    <Button
                      caption={TEXT_DISABLE}
                      onClick={() => this.handleClickEnabled(false)}
                    />
                  </div>
                </div>

              </ComponentToolbar>
            )

            : null
        }
        {
          enabled
            ? this.state.textFields.map((el, index) => (
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
