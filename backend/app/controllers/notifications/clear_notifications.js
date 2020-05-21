import { NotificationManager } from "../../models/NotificationManager";

export const clear_notifications = (body, session) => {
    return new Promise((resolve, reject) => {
        NotificationManager.clearNotifications(session.username)
        .then(() => {
            resolve();
        })
        .catch(reject);
    })
}