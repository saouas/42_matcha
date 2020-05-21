import { jwt_keys } from '../../config';
import jwt from 'jsonwebtoken';
import { UserManager } from '../models/UserManager';
import { read } from 'fs';

/**
 * middleware require a session token
 */
export let needAuth = (req, res, next) => {
    const tokenHeader = req.get('Authorization');
    let session = {};
    Promise.resolve()
    .then(() => {
        if (!tokenHeader)
            throw new Error('user not connected');
    })
    .then(() => {
        const token = jwt.verify(tokenHeader, jwt_keys.auth_token.key);
        return token;
    })
    .then((token) => {
        session.username = token.username;
        req.session = session;
        next();
    })
    .catch((err) => {
        console.log(err.message);
        res.status(401).end();
    });
}