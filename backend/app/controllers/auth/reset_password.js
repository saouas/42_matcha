import { SchemaValidator } from '../../models/SchemaValidator';
import { Validator } from '../../models/Validator';
import { bcrypt_conf, jwt_keys } from '../../../config';
import bcrypt from 'bcryptjs';
import { UserManager } from '../../models/UserManager';
import jwt from 'jsonwebtoken';
import { e_error } from '../../models/e_error';

const reset_password_schema = new SchemaValidator({
    token: Validator.jwt_token,
    password: Validator.password
})

export const reset_password = (body) => {
    return new Promise((resolve, reject) => {
        let data;
        let token;
        reset_password_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            token = jwt.verify(data.token, jwt_keys.reset_password.key);
            return bcrypt.hash(data.password, bcrypt_conf.salt_rounds)
        })
        .then((hashedPassword) => {
            return UserManager.updatePasswordByResetCode(token.username, token.reset_code, hashedPassword);
        })
        .then((updated) => {
            if (!updated) throw e_error.INVALID_TOKEN;
            resolve();
        })
        .catch((err) => {
            if (err instanceof jwt.JsonWebTokenError)
                return reject(e_error.INVALID_TOKEN)
            reject(err);
        });
    })
}