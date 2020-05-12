import { Auth, AuthPayload } from 'resources/interfaces/interfaces';

const loginButton: HTMLButtonElement | null = document.querySelector('#loginBtn');
const logOutBtn: HTMLButtonElement | null = document.querySelector('#logOutBtn');
const logInView: HTMLElement | null = document.querySelector('.logInView');
const loggedInView: HTMLElement | null = document.querySelector('.loggedInView');
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

    let response: Auth = await fetch(`${api}login`, {
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
    chrome.storage.local.remove(['name', 'token']);
})

// needs refactoring
if ( logInView && loggedInView ) {
    
    chrome.storage.local.get(['token'], res => {
        if ( res.token && res.token.length > 0 ) {
            loggedInView.style.display = 'block';
            logInView.style.display = 'none';
        } else {
            loggedInView.style.display = 'none';
            logInView.style.display = 'block';
        }
    })

    chrome.storage.onChanged.addListener( (changes) => {
        
        for (let key in changes) {
    
            let change = changes[key];
    
            if ( change.newValue && key === 'token' ) {
                // token added show welcome div
                loggedInView.style.display = 'block'
                logInView.style.display = 'none';
                
            }
    
            if ( change.oldValue && key === 'token' ) {
                // token removed show login div
                loggedInView.style.display = 'none'
                logInView.style.display = 'block';
            }
        }
    })
}