import { SchemaValidator } from '../../models/SchemaValidator';
import { Validator } from '../../models/Validator';
import uuid from 'uuid/v4';
import { UserManager } from '../../models/UserManager';
import jwt from 'jsonwebtoken';
import { jwt_keys } from '../../../config';
import { MailManager } from '../../models/MailManager';

const ask_reset_password_schema = new SchemaValidator({
    username: Validator.username
})

export const ask_reset_password = (body) => {
    return new Promise((resolve, reject) => {
        let reset_code;
        let data;
        ask_reset_password_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            reset_code = uuid();
            return UserManager.updateResetCode(freshData.username, reset_code);
        })
        .then((mail) => {
            const payload = {
                username: data.username,
                reset_code: reset_code
            }
            const token = jwt.sign(payload, jwt_keys.reset_password.key, {
                expiresIn: jwt_keys.reset_password.expire
            })
            if (mail)
                return MailManager.reset_code(mail, token);
        })
        .then(() => {
            resolve();
        })
        .catch(reject);
    })
}