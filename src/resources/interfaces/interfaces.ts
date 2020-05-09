export interface AuthPayload {
    email: string;
    password: string;
}

export interface Auth {
    name: string;
    subTier?: string;
    token: string;
    token_type?: string;
    expires_in?: number;
}

export interface LinkPayload {
    link: string;
    life_cycle: string;
    days?: number;
}

export interface Link {
    link: string
}

export interface ErrorResponse {
    error: string;
}

export interface ResponseChannelPort {
    name: 'responseChannelPort'
}

export interface RenderContexts {
    contextTitle: string;
    contextId: string;
    contexts: string[];
    childContexts: string[];
    handler: ( context: chrome.contextMenus.OnClickData, cycle: string ) => void; 
}