import { UserManager } from "../../models/UserManager";

export const like_history = (body, session) => {
    return new Promise((resolve, reject) => {
        UserManager.getLikeHistory(session.username)
        .then((data) => {
            resolve(data);
        })
        .catch(reject);
    })
}