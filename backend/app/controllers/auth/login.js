import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Validator } from '../../models/Validator';
import { SchemaValidator } from '../../models/SchemaValidator';
import { UserManager } from '../../models/UserManager';
import { jwt_keys } from '../../../config';
import { e_error } from '../../models/e_error';
import { Localisation } from '../../models/Localisation';

let login_schema = new SchemaValidator({
    username: Validator.username,
    password: Validator.password
})

const production = process.env.NODE_ENV === 'production';

export let login = (body, session, full_req) => {
    return new Promise((resolve, reject) => {
        let data;
        login_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            console.log('validated login schema');
            return UserManager.getPassByUsername(data.username);
        })
        .then((UserPassword) => {
            return bcrypt.compare(data.password, UserPassword);
        })
        .then((validPassword) => {
            if (!validPassword) throw (e_error.BAD_CREDENTIALS);
            return UserManager.updateLastSeen(data.username);
        })
        .then(() => {
            const token = jwt.sign({
                username: data.username
            }, jwt_keys.auth_token.key, {
                expiresIn: jwt_keys.auth_token.expire
            });
            resolve({
                token: token,
                username: data.username
            })
        })
        .then(() => {
            const ip = production ? full_req.ip.replace('::ffff:', '') : '195.12.50.233';
            return Localisation.search(ip)
        })
        .then((geo) => {
            return UserManager.updateGeo(data.username, geo.lat, geo.lon)
        })
        .catch((err) => {
            if (err === e_error.NOT_FOUND)
                return reject(e_error.BAD_CREDENTIALS);
            if (err === e_error.BAD_CREDENTIALS)
                return reject(e_error.BAD_CREDENTIALS);
            if (err === e_error.CANNOT_LOCALISE)
                return console.log('cannot get user localisation');
            reject(err);
        })
    })
}