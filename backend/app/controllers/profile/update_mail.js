import { SchemaValidator } from '../../models/SchemaValidator'
import { Validator } from '../../models/Validator'
import { UserManager } from '../../models/UserManager';
import { e_error } from '../../models/e_error';

const update_mail_schema = new SchemaValidator({
    mail: Validator.mail
})

export const update_mail = (body, session) => {
    return new Promise((resolve, reject) => {
        let data;
        update_mail_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            return UserManager.mailExist(data.mail, session.username);
        })
        .then((isExist) => {
            if (isExist) throw e_error.MAIL_EXIST;
            return UserManager.updateMail(session.username, data.mail);
        })
        .then(() => {
            resolve();
        })
        .catch(reject);
    })
}