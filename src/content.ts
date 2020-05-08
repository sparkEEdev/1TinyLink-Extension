/* let modal: HTMLElement = document.createElement('div');
modal.classList.add('oneTinyModal');
modal.innerText = 'Link created and copied to clipboard!';
document.body.appendChild(modal); */

chrome.runtime.onMessage.addListener((request, _sender, _response) => {

    if ( request.action === 'display-modal' ) {
        // logic to display a message modal
    }
})