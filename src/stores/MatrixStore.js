import { writable } from "svelte/store";
import { browser } from '$app/env'

let savedUser = browser && localStorage.getItem('auth')

export const matrixAuth = writable(savedUser ? JSON.parse(savedUser) : '');
export const IsUserLogged = writable(false)


if (browser) {
    matrixAuth.subscribe(data => {
        localStorage.auth = JSON.stringify(data)
        if(data.access_token){
            IsUserLogged.set(true)
        }
        else{
            IsUserLogged.set(false)
        }
    })
}

