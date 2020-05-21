
export const api = {
    domain: process.env.API_DOMAIN || 'localhost:8080',
    protocol: 'http'
}

export const web = {
    domain: process.env.WEB_DOMAIN || 'localhost:3000',
    protocol: 'http'
}

export const express = {
    port: process.env.EXPRESS_PORT || 8080
}

export const jwt_keys = {
    auth_token: {
        key: process.env.AUTH_TOKEN_KEY || 'PRIVATE_KEY',
        expire: '2h'
    },
    registration_token: {
        key: process.env.REGISTRATION_TOKEN_KEY || 'PRIVATE_KEY_TWO',
        expire: '24h'
    },
    reset_password: {
        key: process.env.RESET_TOKEN_KEY || 'PRIVATE_KEY_RESET_PASSWORD',
        expire: '24h'
    }
}

export const bcrypt_conf = {
    salt_rounds: 2
}

export const mail = {
    service: process.env.MAIL_SERVICE || 'NO_SERVICE',
    auth:{
        user: process.env.MAIL_USER || 'MAIL_USER',
        pass: process.env.MAIL_PASS || 'MAIL_PASS',
    }
}

export const folder = {
    profile_pictures: __dirname + '/public/profile_pictures',

}

export const public_url = {
    profile_pictures: `${api.protocol}://${api.domain}/public/profile_pictures`,
}

const config = {
    express,
    jwt_keys,
    bcrypt_conf,
    mail,
    api,
    web,
    folder,
    public_url
}

export default config;