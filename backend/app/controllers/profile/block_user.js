import { SchemaValidator } from '../../models/SchemaValidator';
import { Validator } from '../../models/Validator';
import { UserManager } from '../../models/UserManager';
import { e_error } from '../../models/e_error';


const schema = new SchemaValidator({
    username: Validator.username
})

export const block_user = (body, session) => {
    return new Promise((resolve, reject) =>{
        let data;
        schema.validate(body)
        .then((FreshData)=>{
            data = FreshData;
            if (data.username == session.username) throw (e_error.CANNOT_BLOCK);
            return UserManager.block_user(session.username, data.username)
        })
        .then(()=>{
            resolve()
        })
        .catch(reject);
    })
}