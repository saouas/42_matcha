import { NotificationManager } from "../../models/NotificationManager";

export const notifications = (body, session) => {
    return new Promise((resolve, reject) => {
        NotificationManager.getNotifications(session.username)
        .then((data) => {
            resolve(data);
        })
        .catch(reject);
    })
}