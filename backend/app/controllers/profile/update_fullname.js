import { SchemaValidator } from '../../models/SchemaValidator'
import { Validator } from '../../models/Validator'
import { UserManager } from '../../models/UserManager';

const update_fullname_schema = new SchemaValidator({
    first_name: Validator.first_name,
    last_name: Validator.last_name
})

export const update_fullname = (body, session) => {
    return new Promise((resolve, reject) => {
        let data;
        update_fullname_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            return UserManager.updateFullName(session.username, data.first_name, data.last_name)
        })
        .then(() => {
            resolve()
        })
        .catch(reject);
    })
}