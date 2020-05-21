import 'resources/extensions/HTMLElementExtensions';
import { Link } from "resources/interfaces/interfaces";

const formIFrame: HTMLIFrameElement = document.createElement('iframe');
formIFrame.setAttributes({ class: 'tinyFrame', id: 'formFrame' });
formIFrame.src = chrome.runtime.getURL('content/formIFrame.html');
document.body.appendChild(formIFrame);

const responseIFrame: HTMLIFrameElement = document.createElement('iframe');
responseIFrame.setAttributes({ class: 'tinyFrame', id: 'responseFrame' });
responseIFrame.src = chrome.runtime.getURL('content/responseIFrame.html');
document.body.appendChild(responseIFrame);

// TODO: refactor the style changes
const requestFormHandler = ( _message, _sender, response ): void => {
    formIFrame.setAttribute('style', 'z-index: 99999; opacity: 1');
    response({ success: 'request received' });
}

const linkHandler = ( _message: Link, _sender, response ): void => {
    responseIFrame.setAttribute('style', 'z-index: 99999; opacity: 1');
    response({ success: 'link received' });
}

const errorHandler = ( _message, _sender, response ): void => {
    responseIFrame.setAttribute('style', 'z-index: 99999; opacity: 1');
    response({ success: 'error received' });
}

const hideHandler = ( _message, _sender, response ): void => {
    formIFrame.setAttribute('style', 'z-index: -99999; opacity: 0');
    response({ success: 'form hidden' });
}

const tokenExpiredHandler = ( _message, _sender, response ): void => {
    responseIFrame.setAttribute('style', 'z-index: 99999; opacity: 1');
    response({ success: 'logged out' });
}


const hideResponseHandler = ( _message, _sender, response ): void => {
    responseIFrame.setAttribute('style', 'z-index: -99999; opacity: 0');
    response({ success: 'copied' });
}

// eventName: handlerName pairs
const eventHandlers = {
    requestForm: requestFormHandler,
    link: linkHandler,
    hideForm: hideHandler,
    error: errorHandler,
    tokenExpired: tokenExpiredHandler,
    hideResponse: hideResponseHandler,
}

chrome.runtime.onMessage.addListener( ( message, sender, res ): void => {
    // here we listen for background messages and animate iframes accordingly
    // data manipulation is happening in the formIFrame.ts && responseIFrame.ts 
    for( let event in eventHandlers ) {
        
        if ( message[event] ) {
            return eventHandlers[event]( message, sender, res );
        }
    }

    res({ end: 'done' });
});