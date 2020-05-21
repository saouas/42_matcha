import { get_notification_type,e_notification_type } from "../models/e_notification_type";
import { NotificationManager } from '../models/NotificationManager';
import { SocketManager } from "../models/SocketManager";

class NotificationController {
    static sendNotification(username, user_pointed, typeNotifications) {
        SocketManager.io.to(username).emit('notification', {
            type: typeNotifications,
            date: Date.now(),
            username: user_pointed
        });
        NotificationManager.setNotifications(username, user_pointed, typeNotifications)
        .then((result) => {
            let msg = get_notification_type(typeNotifications);
            console.log(`success creation : ${username} -> ${msg} -> ${user_pointed}`);
        })
        .catch(console.log)
    }
}

export { NotificationController }