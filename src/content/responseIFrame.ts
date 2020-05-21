const responseDiv: HTMLElement | null = document.querySelector('#tinyResponseModal');
const tinyInput: HTMLInputElement | null | undefined = responseDiv?.querySelector('#tinyInput');
const copyButton: HTMLButtonElement | null = document.querySelector('#copyButton');
const responseMessage: HTMLElement | null = document.querySelector('#tinyMessage');

const linkHandler = (message, response): void => {
    responseDiv?.setAttribute('style', 'display: grid');
    responseMessage?.setAttribute('style', 'display: none');
    tinyInput?.setAttribute('value', message.link);
    response();
}

const tokenExpiredHandler = ( _message, response ): void => {
    
    responseDiv?.setAttribute('style', 'display: none');
    responseMessage?.setAttribute('style', 'display: block');
    responseMessage!.innerText = 'Please Log in again!'
    response({ loggedOut: 'logged out' })
}

const errorHandler = ( message, response ): void => {
    // if we get error from the api display it
    responseDiv?.setAttribute('style', 'display: none');
    responseMessage?.setAttribute('style', 'display: block');
    responseMessage!.innerText = message.error;
    response({ success: 'error received' });
}

const eventHandlers = {
    link: linkHandler,
    tokenExpired: tokenExpiredHandler,
    error: errorHandler,
}

chrome.runtime.onMessage.addListener( ( message, _sender, res ): void => {
    // this is where we just wanna append data depending on the message type we receive
    // the hiding and showing of the notification is handled by same messages in the content.ts
    for( let event in eventHandlers ) {
        
        if ( message[event] ) {
            return eventHandlers[event]( message, res );
        }
    }
});

copyButton?.addEventListener('click', () => {

    tinyInput?.select();

    document.execCommand('copy');

    chrome.runtime.sendMessage({ copyButtonClicked: true }, (res) => {
        console.log(res);
    });

})