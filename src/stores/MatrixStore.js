import { writable } from "svelte/store";

export const matrixAuth = writable({
    user_id: "",
    access_token: "",
    home_server: "",
    device_id: ""
});
export const isLoggedIn = writable(false)
