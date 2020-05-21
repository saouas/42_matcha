import { UserManager } from '../../models/UserManager';
import { SchemaValidator } from '../../models/SchemaValidator';
import { Validator } from '../../models/Validator';
import { RedirectRequest } from '../../models/RedirectRequest';
import { jwt_keys, web } from '../../../config';
import jwt from 'jsonwebtoken';
import { e_error } from '../../models/e_error';

const activate_account_schema = new SchemaValidator({
    token: Validator.jwt_token
})

export const activate_account = (body) => {
    return new Promise((resolve, reject) => {
        let data;
        activate_account_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            const decoded = jwt.verify(data.token, jwt_keys.registration_token.key);
            return UserManager.activate_account(decoded.username);
        })
        .then((updated) => {
            if (!updated) throw (e_error.INVALID_TOKEN);
            resolve(new RedirectRequest(`${web.protocol}://${web.domain}/login`));
        })
        .catch((err) => {
            if (err instanceof jwt.JsonWebTokenError)
                return reject(e_error.INVALID_TOKEN)
            reject(err);
        });
    })
}