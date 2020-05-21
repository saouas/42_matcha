import { SchemaValidator } from "../../models/SchemaValidator";
import { Validator } from "../../models/Validator";
import { TagManager } from "../../models/TagManager";

const remove_tag_schema = new SchemaValidator({
    name: Validator.tag
})

export const remove_tag = (body, session) => {
    return new Promise((resolve, reject) => {
        let data;
        remove_tag_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            return TagManager.removeUserLike(session.username, data.name);
        })
        .then(() => {
            resolve();
        })
        .catch(reject);
    })
}