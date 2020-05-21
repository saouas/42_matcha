import { SchemaValidator } from "../../models/SchemaValidator";
import { Validator } from "../../models/Validator";
import { UserManager } from "../../models/UserManager";
import { e_error } from "../../models/e_error";
import { add_user_to_update } from "../../tasks/update_popularity_score";
import { NotificationController } from "../NotificationController";
import { e_notification_type } from "../../models/e_notification_type";
import { RoomController } from "../RoomController";


const like_schema = new SchemaValidator({
    username: Validator.username
})

export const like = (body, session) => {
    return new Promise((resolve, reject) => {
        let data;
        like_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            if (data.username == session.username) throw e_error.CANNOT_LIKE;
            return (UserManager.isBlockedUser(data.username, session.username))
        })
        .then((blocked) => {
            if (blocked) throw e_error.BLOCKED_BY_USER;
            return UserManager.likeUser(session.username, data.username);
        })
        
        .then((like_you) => {
            add_user_to_update(data.username);
            NotificationController.sendNotification(data.username, session.username, e_notification_type.LIKE_YOU);
            if (like_you) {
                console.log('its a match!')
                RoomController.createRoomBetween(data.username, session.username).catch(console.log);
                NotificationController.sendNotification(data.username, session.username, e_notification_type.MATCH_LIKE);
            }
            resolve();
        })
        .catch(reject);
    })
}