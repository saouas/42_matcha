import { SchemaValidator } from '../../models/SchemaValidator';
import { Validator } from '../../models/Validator';
import { UserManager } from '../../models/UserManager';


const schema_localisation = new SchemaValidator({
    lat : Validator.lat,
    lon : Validator.lon
})

export const update_localisation = (body, session) => {
    return new Promise((resolve, reject) => {
        schema_localisation.validate(body)
        .then((data) => {
            return UserManager.updateGeo(session.username, data.lat, data.lon);
        })
        .then(() => {
            resolve();
        })
        .catch(reject)
    })
}