const responseDiv: HTMLDivElement | null = document.querySelector('#tinyResponseModal');

chrome.runtime.onMessage.addListener( ( message, _sender, res ): void => {
    // this is where we just wanna append data depending on the message type we receive
    // the hiding and showing of the notification is handled by same messages in the content.ts
    if (!responseDiv) return;

    if ( message.link ) {

        responseDiv.innerText = 'Copied to Clipboard!';

        return res();
    }

    if ( message.tokenRefresh ) {
        responseDiv.innerText = 'Session renewed, try again!'

        return res({ success: 'session renewed' })
    }

    if ( message.error ) {
        // if we get error from the api display it here
        
        responseDiv.innerText = message.error;

        return res({ success: 'error received' });
    }
});