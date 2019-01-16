const dev = false;

import React, { Fragment, Component } from "react";

import log from './helpers/helper-logger'

import ComponentWidget from "./components/component-widget";

export default class App extends Component {

    constructor(props){
        super(props)

        this.state = {
            textElements: []
        }
    }

    componentDidMount(){

        log('* Fairlanguage 0.6 - App')

        addEventListener('click', (event) => {

            log('Click')

            const elementClickedOn = event.toElement;

            //First we check if there is already a widget connected to the element that was clicked on
            let isAlreadyInjected;

            this.state.textElements.forEach((el) => isAlreadyInjected = el[0]===elementClickedOn)

            log(`isAlreadyInjected: ${isAlreadyInjected}`)

            if(isAlreadyInjected) return;

            const isTextArea = elementClickedOn.type === 'textarea'
            const isContentEditable = elementClickedOn.hasAttribute('contenteditable')

            //Is the parent element's content editable? (Slack)
            const parentElementsContentIsEditable = elementClickedOn.parentNode.hasAttribute('contenteditable')

            log(`isTextArea: ${isTextArea}`)
            log(`isContentIsEditable: ${isContentEditable}`)
            log(`parentElementsContentIsEditable: ${parentElementsContentIsEditable}`)
            
            if(!isTextArea&&!isContentEditable&&!parentElementsContentIsEditable) return;

            if(dev)
            elementClickedOn.style.background = 'lightblue'

            if(dev)
            console.log(elementClickedOn)

            const parentElement = parentElementsContentIsEditable?elementClickedOn.parentNode.parentNode:elementClickedOn.parentNode;
            
            const containerElement = document.createElement('div');

            parentElement.appendChild(containerElement);

            let textElements = this.state.textElements

            /*
             Custom @TODO: 
            */

            if(window.location.href.includes('slack.com')){
                //Search for certain elements
                console.log(document.getElementById("primary_file_button"))

                const element = document.getElementsByClassName('btn_unstyle msg_mentions_button')[0]
                const container = document.createElement('div')
                container.style.marginLeft = '-28px';
                container.style.transform = 'translateY(-23px)'
                
                element.prepend(container)

                textElements.push([elementClickedOn, container])

            }else{
                textElements.push([elementClickedOn, parentElement])
            }

            this.setState({
             textElements:textElements
            })

            log(textElements.length)

        })

    }

    render(){
       return (
           <Fragment>
               {
                   this.state.textElements.map((el, index) => {
                        return <ComponentWidget
                            key={index} 
                            textElement={el[0]}
                            containerElement={el[1]} 
                        />
                   })
               }
           </Fragment>
       )
    }
}