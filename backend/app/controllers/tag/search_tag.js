import { TagManager } from "../../models/TagManager";
import { Validator } from "../../models/Validator";
import { SchemaValidator } from "../../models/SchemaValidator";

const search_tag_schema = new SchemaValidator({
    name: Validator.search_tag
})

export const search_tag = (body) => {
    return new Promise((resolve, reject) => {
        search_tag_schema.validate(body)
        .then((freshData) => {
            return TagManager.search(freshData.name)
        })
        .then((tags) => {
            resolve({
                tags: tags
            });
        })
        .catch(reject);
    })
}