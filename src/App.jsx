import React, { Fragment, Component } from 'react';

import log from './helpers/helper-logger';

import ComponentToolbar from './components/component-toolbar';
import ComponentWidget from './components/component-widget';

import ModulePlacingGoogle from './modules/placing/google';

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

import config from '../config';

import * as manifest from '../manifest.json'
import { hostname } from 'os';

const dev = true;

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      enabled: true,
      activated: false,
      visible: true,
      textFields: [],
    };
  }

  componentWillMount() {

    chrome.storage.local.get(['deactivated', 'enabled', 'visible'], (storage) => {

      const isEnabled = storage.enabled;
      const isActivated = storage.deactivated.indexOf(window.location.hostname) === -1;
      const isVisible = storage.visible;

      // log(`List of deactivated hostnames:`)
      // console.log(storage.deactivated)
      // log(`isActivated: ${isActivated}`)

      this.setState({
        enabled: isEnabled,
        activated: isActivated,
        visible: isVisible,
      }, () => {
        log(`Extension is ${this.state.enabled ? 'ENABLED' : 'DISABLED'} (in general)`);
        log(`Extention is ${this.state.visible ? 'VISIBLE' : 'HIDDEN'} (in general)`);   
        log(`Extention is ${this.state.activated ? 'ACTIVE' : 'DEACTIVATED'} (on this web app)`);     
      });

    
    });

  }

  componentDidMount() {

    log(`Extension ${manifest.version} - init`);
    /*
    * Just gimme ONE call - they'll all be gone.
    */
    chrome.runtime.onMessage.addListener(
      (message, sender) => {
        log(JSON.stringify(message));
        switch (message.command) {
          case 'erase':
            this.setState({
              textFields: [],
            });
            break;
          case 'hide':
            this.setState({
              visible: false,
            });
            break;
          case 'show':
            this.setState({
              visible: true,
            });
            break;

          case 'deactivate':

            // Erase everything and run.
            this.setState({
              textFields: [],
            });

            //Remember this place. Do.not.come.back.

            const url = window.location.hostname;

            chrome.storage.local.get(['deactivated'], (result) => {

              let list = result.deactivated!==undefined?result.deactivated:[];

              list.push(url)

              chrome.storage.local.set({deactivated: list}, (result) => {

                log(`Added ${url} to blacklist.`)

                console.log(list)
              
              })

            })

            break;

            case 'activate':

            chrome.storage.local.get(['deactivated'], function(result) {

              let list = result.deactivated!==undefined?result.deactivated:[];

              // Remove item
              list.splice(list.indexOf(window.location.hostname), 1)

              chrome.storage.local.set({deactivated: list}, (result) => {

                log(`Removed ${window.location.hostname} from  blacklist. New list:`)
                console.log(list);

                this.setState({
                  visible: true,
                  activated: true,
                  textFields: [],
                }, () => {
                });
              
              })

            })

            break;

          default:
            log('Ain`t got no more to say (It`s just language).');
            break;
        }
      },
    );

    window.addEventListener('click', (event) => {

      /*
      * Are we live? That shit on?
      */
      if(!this.state.enabled)
      return log(`Extension is disabled`)

      /*
      * Are we actually allowed in here?
      */
      if(!this.state.activated)
      return log(`The extention is deactivated on this web app.`)

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
        isAlreadyInjected = el.hasAttribute('fl');
        el = el.parentNode;
        depth += 1;
      }

      log(`isAlreadyInjected: ${isAlreadyInjected}`);

      if (isAlreadyInjected) return;

      /*
      *  Second, check if the element is any kind of text field.
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
        isParentElementContentIsEditable = el.hasAttribute('contenteditable');
        el = el.parentNode;
        depth += 1;
      }

      log(`isParentElementContentIsEditable (${depth}): ${isParentElementContentIsEditable}`);

      // If none of that is the case it just wasn't a txt field (sorry :/).
      if (!isTextArea && !isIn && !isInput && !isSearch && !isContentEditable && !isParentElementContentIsEditable) return;

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
        textElement = e[0]
        widgetContainer = e[1]

      } else
      if (window.location.href.includes('twitter.com')) {

        hasCustomPosition = true

        const e = ModulePlacingTwitter(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else
      if (window.location.href.includes('outlook.live.com')) {

        hasCustomPosition = true

        const e = ModulePlacingOutlookMail(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else
      if (window.location.href.includes('mail.yahoo.com')) {

        hasCustomPosition = true

        const e = ModulePlacingYahooMail(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else  
      if (window.location.href.includes('mail.google.com')) {
        hasCustomPosition = true

        const e = ModulePlacingGoogleMail(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else
      if (window.location.href.includes('facebook.com')) {

        hasCustomPosition = true

        const e = ModulePlacingFacebook(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else       
      if (window.location.href.includes('en.zalando.de')) {

        hasCustomPosition = true

        const e = ModulePlacingZalando(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else     
      if (window.location.href.includes('messenger.com')) {

        hasCustomPosition = true

        const e = ModulePlacingMessenger(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else     
      if (window.location.href.includes('meet.google.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingGoogleMeet(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else    
      if (window.location.href.includes('instagram.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingInstagram(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else 
      if (window.location.href.includes('teams.microsoft.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingMicrosoftTeams(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else    
      if (window.location.href.includes('whatsapp.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingWhatsapp(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else      
      if (window.location.href.includes('telegram.org')) {

        hasCustomPosition = true;

        const e = ModulePlacingTelegram(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else {

      /*
      * We don't have a custom position for this app, so just place it inside the parent node.
      */

        const parentElement = isParentElementContentIsEditable ? elementClickedOn.parentNode.parentNode : elementClickedOn.parentNode;
        
        textElement = elementClickedOn;
        widgetContainer = parentElement;

      }

      log(`hasCustomPosition (MODULE): ${hasCustomPosition}`)

      textFields.push([textElement, widgetContainer]);

      this.setState({
        textFields
      });

      /*
      * Mark the element, so we wont give it a widget again.
      */

      elementClickedOn.setAttribute("fl", "lala");

      log(`Set widget #${textFields.length}`);

    });

  }

  render() {
    return (
      <Fragment>
        {config.default.toolbar ? <ComponentToolbar /> : ''}
        {
          this.state.textFields.map((el, index) => (
            <ComponentWidget
              key={index}
              visible={this.state.visible}
              textElement={el[0]}
              containerElement={el[1]}
            />
          ))
        }
      </Fragment>
    );
  }
}
