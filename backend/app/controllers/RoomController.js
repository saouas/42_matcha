import { RoomManager } from "../models/RoomManager";
import { NotificationController } from "./NotificationController";
import { e_notification_type } from "../models/e_notification_type";
import { SocketManager } from "../models/SocketManager";

class RoomController {
    static createRoomBetween(username1, username2) {
        return new Promise((resolve, reject) => {
            RoomManager.insertRoom(username1, username2)
            .then((roomUID) => {
                console.log(`created room ${roomUID}`);
                resolve(roomUID);
            })
            .catch(reject)
        })
    }

    static removeRoomBetween(username1, username2) {
        return new Promise((resolve, reject) => {
            RoomManager.removeRoom(username1, username2)
            .then(() => {
                console.log(`room removed`);
                resolve();
            })
            .catch(reject)
        })
    }

    static sendMessage(username_from, username_to, text) {
        return new Promise((resolve, reject) => {
            RoomManager.insertMessage(username_from, username_to, text)
            .then(() => {
                console.log('message sent');
                NotificationController.sendNotification(username_to, username_from, e_notification_type.RECEIVE_MESSAGE);
                SocketManager.io.emit(`DM/${username_to}/${username_from}`, {
                    username: username_from,
                    date: Date.now(),
                    text: text,
                })
                resolve();
            })
            .catch(reject);
        })
    }
}

export { RoomController }