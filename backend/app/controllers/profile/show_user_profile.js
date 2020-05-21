import { SchemaValidator } from "../../models/SchemaValidator";
import { Validator } from "../../models/Validator";
import { UserManager } from "../../models/UserManager";
import { e_error } from "../../models/e_error";
import { add_user_to_update } from "../../tasks/update_popularity_score";
import { NotificationController } from "../NotificationController";
import { e_notification_type } from "../../models/e_notification_type";
import { SocketManager } from '../../models/SocketManager';

const show_user_profile_schema = new SchemaValidator({
    username: Validator.username
})

export const show_user_profile = (body, session) => {
    return new Promise((resolve, reject) => {
        let data;
        let user;
        show_user_profile_schema.validate(body)
        .then((freshData) => {
            data = freshData;
            return (UserManager.isBlockedUser(data.username, session.username))
        })
        .then((blocked) => {
            if (blocked) throw e_error.BLOCKED_BY_USER;
            return UserManager.getUserProfile(data.username, session.username);
        })
        .then((newUser) => {
            if (!newUser)
                throw (e_error.NOT_FOUND);
            user = newUser;
            user.online = SocketManager.isOnline(data.username);
            if (session.username !== data.username)
                return UserManager.historicAddProfileVisit(session.username, data.username);
        })
        .then(() => {
            add_user_to_update(data.username);
            if (session.username !== data.username)
                NotificationController.sendNotification(data.username, session.username, e_notification_type.VISIT_YOU);

            resolve({
                user: user
            });
        })
        .catch(reject);
    })
}