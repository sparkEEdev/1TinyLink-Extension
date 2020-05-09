import { ResponseChannelPort } from 'resources/interfaces/interfaces';
import 'resources/extensions/HTMLElementExtensions';

// reusable responseModal element
const responseModal: HTMLElement = document.createElement('div');
responseModal.classList.add('oneTinyModal');
document.body.appendChild(responseModal);

const responseChannelPortName: ResponseChannelPort = { name: 'responseChannelPort' };
const responseChannelPort = chrome.runtime.connect(responseChannelPortName);

responseChannelPort.onMessage.addListener(( message ) => {
    
    if ( message.link ) {
        responseModal.innerText = message.link;
        responseModal.fadeInOut();
    }

    if ( message.error ) {
        responseModal.innerText = message.error
        responseModal.fadeInOut();
    }
})