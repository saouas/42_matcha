import { TagManager } from "../../models/TagManager";

export const popular_tag = () => {
    return new Promise((resolve, reject) => {
        TagManager.getMostPopular()
        .then((tags) => {
            resolve({
                tags: tags
            });
        })
        .catch(reject);
    })
}