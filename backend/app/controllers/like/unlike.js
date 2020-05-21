import { SchemaValidator } from "../../models/SchemaValidator";
import { Validator } from "../../models/Validator";
import { UserManager } from "../../models/UserManager";
import { e_error } from "../../models/e_error";
import { add_user_to_update } from "../../tasks/update_popularity_score";
import { NotificationController } from "../NotificationController";
import { e_notification_type } from "../../models/e_notification_type";
import { RoomController } from "../RoomController";


const unlike_schema = new SchemaValidator({
    username: Validator.username
})

export const unlike = (body, session) => {
    return new Promise((resolve, reject) => {
        let data;
        unlike_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            if (session.username == data.username)
                throw e_error.CANNOT_UNLIKE;
            return UserManager.unlikeUser(session.username, data.username);
        })
        .then((liked_you) => {
            add_user_to_update(data.username);
            if (liked_you) {
                NotificationController.sendNotification(data.username, session.username, e_notification_type.MATCH_UNLIKE)
                RoomController.removeRoomBetween(data.username, session.username).catch(console.log);
            }
                
            resolve();
        })
        .catch(reject);
    })
}