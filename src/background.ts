import { Link, LinkPayload } from 'resources/interfaces/interfaces';
import { isValidURL, getHeaders } from 'resources/helpers';

const contextTitle: string = 'Make it Tiny!';
const contextId: string = "1tl";
const contextsArr: string[] = [ "selection", "link", "image", "editable" ];
const validatableContexts: string[] = [ "selectionText", "srcUrl", "linkUrl" ];
const api = process.env.API_URL;

if (!api) {
    throw new Error('API_URL is missing.');
}

const postForm = async ( data: LinkPayload ): Promise<Response> => {

    let headers = await getHeaders();

    return await fetch(`${api}/api/v1/process`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    });
}

const makeTiny = async ( data: LinkPayload, tabId: number ): Promise<void> => {

    let response = await postForm(data);

    if (response.status === 401) {

        chrome.storage.local.remove(['name', 'token', 'subTier', 'token']);

        return chrome.tabs.sendMessage(tabId, { tokenExpired: true }, (res) => console.log( res ));
    }

    let json: any = await response.json();

    let tinyLink: Link = { link: json.link };

    chrome.tabs.sendMessage(tabId, tinyLink, () => {});
}

const handle = ( context: chrome.contextMenus.OnClickData ): string | boolean => {

    // validatableContexts an array of properties delivered by 'context', which potentially hold a valid url

    for ( let i in validatableContexts ) {

        let url = context[validatableContexts[i]];

        if ( url && isValidURL(url) ) return url;
    }

    return false;
}

chrome.runtime.onMessage.addListener( ( message, sender, res ) => {
    // here we listen for incoming message from content script
    // if the message contains our form data we want to make the post request
    // and return success message with payload
    let tab = sender.tab;

    if (!tab?.id) return

    if ( message.submitForm ) {
        // make the request
        makeTiny(message.submitForm, tab.id);

        return res({ success: 'form received' });
    }

    if ( message.hideForm ) {
        // send message to hide the element in the tab
        chrome.tabs.sendMessage(tab.id, message, (res) => {
            console.log(res);
        });
        return res({ success: 'hidden via bg' });
    }

    if ( message.copyButtonClicked ) {
        chrome.tabs.sendMessage(tab.id, { hideResponse: true }, (res) => {
            console.log(res);
        });
    }

    res({ failure: 'Unknown message in the background script.'});
});

chrome.storage.onChanged.addListener( (changes) => {
    // enable - disable context button depending if we have token or not
    for (let key in changes) {

        let change = changes[key];

        if ( change.newValue && key === 'token' ) {
            chrome.contextMenus.update(contextId, {
                enabled: true,
            })
        }

        if ( change.oldValue && key === 'token' ) {
            chrome.contextMenus.update(contextId, {
                enabled: false,
            });
        }
    }
})

chrome.runtime.onInstalled.addListener(() => {
    // initialize extension context menus and update its useability
    chrome.contextMenus.create({
        title: contextTitle,
        contexts: contextsArr,
        id: contextId,
        enabled: false,
    });

    chrome.storage.local.get(['token'], res => {
        if ( res.token && res.token.length > 0 ) {
            chrome.contextMenus.update(contextId, {
                enabled: true,
            });
        } else {
            chrome.contextMenus.update(contextId, {
                enabled: false,
            })
        }
    });
});

chrome.contextMenus.onClicked.addListener((context) => {
    // here we are listening for our custom button click
    // after which we validate our url - check const handle();
    // if we get back a string we send it content script on the frontend
    // and we display the form on the proper tab
    let url = handle(context);

    if ( !url ) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

        let activeTab = tabs[0];
        if (!activeTab.id) return;

        chrome.tabs.sendMessage(activeTab.id, { requestForm: 'link', url: url  }, (res) => {
            console.log(res);
        });
    });
})