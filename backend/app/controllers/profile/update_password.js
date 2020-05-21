import { SchemaValidator } from '../../models/SchemaValidator'
import { Validator } from '../../models/Validator'
import { UserManager } from '../../models/UserManager';
import bcrypt from 'bcryptjs';
import { e_error } from '../../models/e_error';
import { bcrypt_conf } from '../../../config';

const update_password_schema = new SchemaValidator({
    old_password: Validator.password,
    new_password: Validator.password
})

export const update_password = (body, session) => {
    return new Promise((resolve, reject) => {
        let data;
        update_password_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            return UserManager.getPassByUsername(session.username);
        })
        .then((password) => {
            return bcrypt.compare(data.old_password, password);
        })
        .then((isValid) => {
            if (!isValid) throw e_error.BAD_CREDENTIALS;
            return bcrypt.hash(data.new_password, bcrypt_conf.salt_rounds);
        })
        .then((hashedPassword) => {
            return UserManager.updatePassword(session.username, hashedPassword);
        })
        .then(() => {
            resolve();
        })
        .catch(reject)
    })
}