const formElement: HTMLFormElement | null = document.body.querySelector('form');

const submitButton: HTMLAnchorElement | null = document.querySelector('#tinySubmit');
const cancelButton: HTMLAnchorElement | null = document.querySelector('#tinyCancel');
const hiddenLinkInput: HTMLInputElement | null = document.querySelector('#link');

submitButton?.addEventListener('click', () => {

    if (!formElement) return;

    let data = new FormData(formElement);

    let jsonData = Object.fromEntries(data.entries());

    chrome.runtime.sendMessage({ form: jsonData }, (response) => {

        if (!response) return;

        console.log(response, 'successful submit!');

        chrome.runtime.sendMessage({ hide: 'form' }, (response) => {
            formElement?.reset();
            console.log(response);
        });

    });
})

cancelButton?.addEventListener('click', () => {
    chrome.runtime.sendMessage({ hide: 'form' }, (response) => {
        formElement?.reset();
        console.log(response);
    });
})

chrome.runtime.onMessage.addListener( ( message, _sender, res ): void => {

    if ( message.request && message.request === 'link' ) {
        //just append the validated url to the form
        
        hiddenLinkInput?.setAttribute('value', message.url);

        res({ success: 'request received' });
    } 
})