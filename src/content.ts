import 'resources/extensions/HTMLElementExtensions';

const formIFrame: HTMLIFrameElement = document.createElement('iframe');
formIFrame.setAttributes({ class: 'tinyFrame', id: 'formFrame' });
formIFrame.src = chrome.runtime.getURL('content/formIFrame.html');
document.body.appendChild(formIFrame);

const responseIFrame: HTMLIFrameElement = document.createElement('iframe');
responseIFrame.setAttributes({ class: 'tinyFrame', id: 'responseFrame' });
responseIFrame.src = chrome.runtime.getURL('content/responseIFrame.html');
document.body.appendChild(responseIFrame);

chrome.runtime.onMessage.addListener( ( message, _sender, res ): void => {
    // here we listen for background messages and animate iframes accordingly
    // data manipulation is happening in the formIFrame.ts && responseIFrame.ts 

    if ( message.link ) {
        responseIFrame.fadeInOut();
        return res({ success: 'link received' });
    }

    if ( message.request && message.request === 'link' ) {
        
        formIFrame.setAttribute('style', 'z-index: 99999; opacity: 1');
        return res({ success: 'request received' });
    } 

    if ( message.error ) {
        responseIFrame.fadeInOut();
        return res({ success: 'error received' });
    }

    if ( message.hide && message.hide === 'form' ) {
        formIFrame.setAttribute('style', 'z-index: -99999; opacity: 0');
        return res({ success: 'form hidden' });
    }

    res({ end: 'done' });
});