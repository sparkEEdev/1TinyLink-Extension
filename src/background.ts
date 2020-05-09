import { Link, /* ErrorResponse, */ ResponseChannelPort, RenderContexts } from 'resources/interfaces/interfaces';
import { isValidURL/* , copyToClipboard */ } from 'resources/helpers';

const contextTitle: string = 'Make it Tiny!';
const contextId: string = "1tl";
const contextsArr: string[] = [ "selection", "link", "image", "editable" ];
const lifeCycles: string[] = [ "Temporary", "Destructive", "Permanent" ];
const responseChannelPortName: ResponseChannelPort = { name: 'responseChannelPort' };
let responseChannelPort: chrome.runtime.Port;

const makeTiny = ( url: string, lifeCycle: string ): void => {
    
    console.log(url, lifeCycle);

    // post request 

        // copy the fresh tiny link clipboard
        // copyToClipboard(url); 

        // display response
        let data: Link = {
            link: url
        }
        // responseChannelPort.postMessage(data);
        responseChannelPort.postMessage(data);
}

chrome.runtime.onConnect.addListener((port) => {
    if ( port.name === responseChannelPortName.name ) {
        responseChannelPort = port;
    }
});

const handle = (context: chrome.contextMenus.OnClickData, lifeCycle: string ): void => {
    
    // context.selectionText
    if ( context.selectionText && isValidURL(context.selectionText) )
    {
        return makeTiny(context.selectionText, lifeCycle);
    }

    // context.srcUrl
    if ( context.srcUrl && isValidURL(context.srcUrl) )
    {
        return makeTiny(context.srcUrl, lifeCycle);
    }

    // context.linkUrl
    if ( context.linkUrl && isValidURL(context.linkUrl)) 
    {
        return makeTiny(context.linkUrl, lifeCycle);
    }

     // context.mediaType === 'image' - srcUrl/linkUrl
    if ( context.mediaType && context.mediaType === 'image' ) 
    {   
        // temporarily disabled for simplicity sake
        /* if ( context.srcUrl && isValidURL(context.srcUrl) ) 
        {
            return makeTiny(context.srcUrl);
        } */

        if ( context.linkUrl && isValidURL(context.linkUrl) ) 
        {
            return makeTiny(context.linkUrl, lifeCycle);
        } 
    }
}

const renderContexts = ({ contextTitle, contextId, contexts, childContexts = [], handler }: RenderContexts ): void => {

    chrome.contextMenus.create({
        title: contextTitle,
        id: contextId,
        contexts: contexts,
        enabled: false,
    });

    childContexts.forEach( value => {

        chrome.contextMenus.create({
            title: value,
            parentId: contextId,
            contexts: contexts,
            onclick: (context) => {
                handler(context, value)
            } 
        });
    })
}

chrome.storage.onChanged.addListener( (changes) => {
        
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

    renderContexts({
        contextTitle: contextTitle,
        contextId: contextId,
        contexts: contextsArr,
        childContexts: lifeCycles,
        handler: handle
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
    })

})