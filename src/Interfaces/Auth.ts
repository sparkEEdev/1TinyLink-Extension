export interface Auth {
    name: string;
    subTier?: string;
    token: string;
    token_type?: string;
    expires_in?: number;
}