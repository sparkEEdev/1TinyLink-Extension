import { Auth } from 'resources/interfaces/interfaces';

// fake api interaction for the background script
const loginButton: HTMLButtonElement | null = document.querySelector('#loginBtn');
const logOutBtn: HTMLButtonElement | null = document.querySelector('#logOutBtn');
const logInView: HTMLElement | null = document.querySelector('.logInView');
const loggedInView: HTMLElement | null = document.querySelector('.loggedInView');

const login = (): void => {

    let data: Auth = {
        name: 'xxx',
        token: 'xxx'
    }

    chrome.storage.local.set(data)
    // save token
    // change popup UI
}

loginButton?.addEventListener('click', () => {
    login();
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
// fake api interaction for the background script