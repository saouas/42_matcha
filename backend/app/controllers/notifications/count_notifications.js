import { NotificationManager } from "../../models/NotificationManager";

export const count_notifications = (body, session) => {
    return new Promise((resolve, reject) => {
        NotificationManager.countNotifications(session.username)
        .then((res) => {
            console.log(res)
            resolve(res);
        })
        .catch(reject);
    })
}