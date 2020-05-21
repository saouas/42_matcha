import { SchemaValidator } from "../../models/SchemaValidator";
import { Validator } from "../../models/Validator";
import { TagManager } from "../../models/TagManager";

const add_tag_schema = new SchemaValidator({
    name: Validator.tag
})

export const add_tag = (body, session) => {
    return new Promise((resolve, reject) => {
        let data;
        add_tag_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            return TagManager.createTagIfNotExist(data.name);
        })
        .then(() => {
            return TagManager.createUserLike(session.username, data.name);
        })
        .then(() => {
            resolve();
        })
        .catch(reject);
    })
}