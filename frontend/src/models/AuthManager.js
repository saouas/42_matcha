import store from '../store/store'
import { setLogged } from '../actions/user';

let logged = false;

if (localStorage.getItem('token')) {
    logged = true;
    store.dispatch(setLogged(true))
}

const isLogged = () => {
    return logged;
}

let token;
const getToken = () => { 
    if (!token)
        token = localStorage.getItem('token');;
    return token;
}

let username;
const getUsername = () => {
    if (!username)
        username = localStorage.getItem('username');
    return username;
}

const setAsLogged = () => {
    logged = true;
    store.dispatch(setLogged(true))
}

const disconnect = () => {
    logged = false;
    username = undefined;
    token = undefined;
    localStorage.clear();
    store.dispatch(setLogged(false))
}

export const AuthManager = {
    isLogged,
    setAsLogged,
    getToken,
    getUsername,
    disconnect
}