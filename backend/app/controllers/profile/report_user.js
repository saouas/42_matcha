import { SchemaValidator } from '../../models/SchemaValidator';
import { Validator } from '../../models/Validator';
import { UserManager } from '../../models/UserManager';

const report_user_schema = new SchemaValidator({
    reported: Validator.username,
    report_flag: Validator.flag_report
})

export const report_user = (body, session) => {
    return new Promise((resolve, reject) => {
        let data;
        report_user_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            return UserManager.report_user(session.username, data.reported, data.report_flag)
        })
        .then(() => {
            resolve()
        })
        .catch(reject);
    })
}