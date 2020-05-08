const pattern: RegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm
const contextTitle: string = 'Make it Tiny!';
const contextId: string = "1tl";
const contextsArr: string[] = [ "selection", "link", "image", "editable" ];
const lifeCycles: string[] = [ "Temporary", "Destructive", "Permanent" ];

const isValidURL = (value: string): boolean => {

    let regex: RegExp = new RegExp(pattern);

    return regex.test(value);
}

const copyToClipboard = (url: string): void => {

    let copyElement: HTMLTextAreaElement = document.createElement('textarea');

    copyElement.value = url;

    document.body.appendChild(copyElement);

    copyElement.select();

    document.execCommand('copy');

    document.body.removeChild(copyElement);
}

const makeTiny = ( url: string, lifeCycle: string ): void => {
    
    console.log(url, lifeCycle);

    // post request 

        // copy the fresh tiny link clipboard
        // copyToClipboard(url); 

        // display response
        // message();
}

const message = (): void => {
    chrome.tabs.query({ active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id || 0, { action: 'display-modal' }, () => {});
    })
}

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

const renderContexts = (
        { contextTitle, contextId, contexts, childContexts = [], handler }: 
        { contextTitle: string, contextId: string, contexts: string[], childContexts: string[], handler: ( context: chrome.contextMenus.OnClickData, cycle: string ) => void } 
    ): void => {

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
})