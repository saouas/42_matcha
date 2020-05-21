import { SchemaValidator } from '../../models/SchemaValidator';
import { Validator } from '../../models/Validator';
import { UserManager } from '../../models/UserManager';
import { SexualityManager } from '../../models/sexualityManager';

const update_profile_schema = new SchemaValidator({
    gender: Validator.gender,
    sexual_orientation: Validator.sexual_orientation,
    age: Validator.age,
    biography: Validator.biography
})

export const update_profile = (body, session) => {
    return new Promise((resolve, reject) => {
        let data;
        update_profile_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            const sexual_orientation = SexualityManager.getSexualOrientation(data.gender, data.sexual_orientation);
            return UserManager.updateProfilInfo(session.username, data.gender, sexual_orientation, data.age, data.biography)
        })
        .then(() => {
            resolve();
        })
        .catch(reject);
    })
}