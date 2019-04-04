import React, { Fragment, Component } from 'react';

import log from './helpers/helper-logger';

import ComponentToolbar from './components/component-toolbar';
import ComponentWidget from './components/component-widget';

import ModulePlacingGoogleMail from './modules/placing/google-mail';
import ModulePlacingYahooMail from './modules/placing/yahoo-mail';
import ModulePlacingOutlookMail from './modules/placing/outlook-mail';

import ModulePlacingSlack from './modules/placing/slack';
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

import { CSS_CLASS_NAME } from './scripts/underline'

import './index.css';

import * as manifest from '../manifest.json';

const dev = true;

const TEXT_PROMPT_ACTIVATE = 'Do you want to use fairlanguage on this website? (Terms and Policy)';
const TEXT_ACTIVATE = 'Yes, I\'m super flamingo with that, sign me up. (ENABLE)';
const TEXT_DEACTIVATE = 'No, I\'m already pretty aware of my language. (DISABLE)';

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

    log(`${manifest.version} initialising`);

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
          consent: generalSettings.consent,
          active: hostSettings.enabled,
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
    chrome.runtime.onMessage.addListener(
      (message, sender) => {
        log(JSON.stringify(message));
        switch (message.command) {
          case 'enabled':
          
            StorageController.setEnabled()
              .then((state) => {
                this.setState({ enabled: state });
                chrome.runtime.sendMessage({ enabled: state });
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
                this.setState({ active: settings.enabled });
                chrome.runtime.sendMessage({ host: settings });
              });

            break;
          case 'host-disable':
          
            StorageController.setHost(false)
              .then((settings) => {
                this.setState({ active: settings.enabled });
                chrome.runtime.sendMessage({ host: settings });
              });

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
      if (!enabled) return log('Detection disabled');
      
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

      const textFields = this.state.textFields;

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

    let enabled = false;

    if (this.state.enabled) {
      if (this.state.active === null) {
        enabled = this.state.consent;
      } else {
        enabled = this.state.active;
      }
    } 

    return enabled;

  }

  /**
   * Sets website / web apps status (enabled: boolean)
   * @param {*} mode 
   */
  setSiteStatus(mode = true) {

    chrome.storage.local.get(['hosts'], (storage) => {

      const hosts = storage.hosts;

      if (storage.hosts.length > 0) {

        let hostInStorage = null;

        storage.hosts.forEach((host, index) => {

          hostInStorage = host.name == window.location.hostname ? host : hostInStorage;

        });

        if (hostInStorage) {
          hosts[hosts.indexOf(hostInStorage)].enabled = !hosts[hosts.indexOf(hostInStorage)].enabled;
          this.setState({ active: hosts[hosts.indexOf(hostInStorage)].enabled });
        } else {
          hosts.push({
            name: window.location.hostname,
            enabled: true,
          });
          this.setState({ active: true });
        }

      } else {

        hosts.push({
          name: window.location.hostname,
          enabled: true,
        });
        this.setState({ active: true });
      }

      if (mode === false) {
        hosts.push({
          name: window.location.hostname,
          enabled: false,
        });
        this.setState({ active: false });
      }


      chrome.storage.local.set({ hosts });

      console.log(storage.hosts);
    
    });

  }

  _handleSetActive() {
    this.setState({
      active: !this.state.active,
    });
  }

  render() {
    const text = dev ? ` (this.state.active: ${this.state.active})` : null;

    const enabled = this.getOverallState();

    return (
      <Fragment>
        {
          this.state.enabled 
          
            ? (
              <ComponentToolbar
                open={false}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                  {TEXT_PROMPT_ACTIVATE}
                </div>
                <div
                  style={{
                    borderRadius: '5px',
                    borderWidth: '2px',
                    borderColor: 'white',
                    padding: '5px',
                    textAlign: 'center',
                  }}

                  onClick={() => {
                    this.setSiteStatus();
                  }}
                >
                  {
                    !this.state.active ? TEXT_ACTIVATE : TEXT_DEACTIVATE
                  }

                </div>

                {
                  this.state.active === null
                    ? (
                      <div
                        style={{
                          borderRadius: '5px',
                          borderWidth: '2px',
                          borderColor: 'white',
                          padding: '5px',
                          textAlign: 'center',
                        }}

                        onClick={() => {
                          this.setSiteStatus(false);
                        }}
                      >
                        {
                    TEXT_DEACTIVATE
                  }

                      </div>
                    )
                    : null
                }

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
