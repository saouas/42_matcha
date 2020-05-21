import { UserManager } from "../../models/UserManager";

export const visit_history = (body, session) => {
    return new Promise((resolve, reject) => {
        UserManager.getVisitHistory(session.username)
        .then((data) => {
            resolve(data);
        })
        .catch(reject);
    })
}