import { Auth, AuthPayload } from 'resources/interfaces/interfaces';

const loginButton: HTMLButtonElement | null = document.querySelector('#loginBtn');
const logOutBtn: HTMLButtonElement | null = document.querySelector('#logOutBtn');
const logInView: HTMLElement | null = document.querySelector('#logInView');
const loggedInView: HTMLElement | null = document.querySelector('#loggedInView');
const name: HTMLSpanElement | null = document.querySelector('#name');
const subTier: HTMLSpanElement | null = document.querySelector('#tier');
const api = process.env.API_URL;

const getAuthPayload = (data): AuthPayload => {

    return {
        email: data.email,
        password: data.password,
    }
}

const login = async (): Promise<void> => {

    let form: HTMLFormElement | null | undefined = logInView?.querySelector('form');
    
    if (!form) return;

    let payload: AuthPayload = getAuthPayload(Object.fromEntries(new FormData(form).entries()));
    let headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });

    let response: Auth = await fetch(`${api}/api/v1/login`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    })
        .then( res => res.json())
        .catch( err => console.log(err) );

    chrome.storage.local.set(response);

}

loginButton?.addEventListener('click', async () => {
    await login();
})

logOutBtn?.addEventListener('click', () => {
    chrome.storage.local.remove(['name', 'token', 'subTier', 'token']);
})

// TODO: needs refactoring
if ( logInView && loggedInView && name && subTier ) {
    
    chrome.storage.local.get(['token', 'name', 'subTier'], res => {
        
        if ( res.token && res.token.length > 0 ) {
            loggedInView.style.display = 'grid';
            logInView.style.display = 'none';

            name.innerText = res.name;
            subTier.innerText = res.subTier;
        } else {
            loggedInView.style.display = 'none';
            logInView.style.display = 'grid';
        }
    })

    chrome.storage.onChanged.addListener( (changes) => {
        
        for (let key in changes) {
    
            let change = changes[key];
    
            if ( change.newValue && key === 'token' ) {
                // token added show welcome view
                loggedInView.style.display = 'grid'
                logInView.style.display = 'none';
            }

            if ( change.newValue && key === 'name') {
                name.innerText = change.newValue;
            }

            if ( change.newValue && key === 'subTier') {
                subTier.innerText = change.newValue;
            }
    
            if ( change.oldValue && key === 'token' ) {
                // token removed show login view
                loggedInView.style.display = 'none'
                logInView.style.display = 'grid';
            }
        }
    })
}