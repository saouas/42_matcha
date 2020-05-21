import { SchemaValidator } from '../../models/SchemaValidator';
import { Validator } from '../../models/Validator';
import { UserManager } from '../../models/UserManager';


const schema = new SchemaValidator({
    gender: Validator.gender,
    sexual_orientation: Validator.sexual_orientation,
    age: Validator.age,
    biography: Validator.biography,
    first_name: Validator.first_name,
    last_name: Validator.last_name,
    profile_pic_0: Validator.profile_pic_0
});

export const check_and_validate = (body, session) => {
    return new Promise((resolve, reject) =>{
        UserManager.getForValidation(session.username)
        .then((data) => {
            return (schema.validate(data))
        })
        .then(() => {
            return (UserManager.full_activate_account(session.username))
        })
        .then(() => {
            resolve();
        })
        .catch(reject)
    })
}