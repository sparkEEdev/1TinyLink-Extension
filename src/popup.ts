import { Auth } from 'Interfaces/Auth';

// fake api interaction for the background script
const loginButton: HTMLButtonElement | null = document.querySelector("#loginBtn");
const clearBtn: HTMLButtonElement | null = document.querySelector("#clear");

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

clearBtn?.addEventListener('click', () => {
    chrome.storage.local.remove(['name', 'token']);
})
// fake api interaction for the background script