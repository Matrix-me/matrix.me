import { writable } from "svelte/store";
import { browser } from '$app/env'

let savedUser = browser && localStorage.getItem('auth')

export const matrixAuth = writable(savedUser ? JSON.parse(savedUser) : '');

if (browser) {
    matrixAuth.subscribe(data => localStorage.auth = JSON.stringify(data))
}
