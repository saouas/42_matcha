import { UserManager } from "../../models/UserManager";
import { SexualityManager } from "../../models/sexualityManager";
import { e_error } from "../../models/e_error";

export const match = (body, session) => {
    return new Promise((resolve, reject) => {
        UserManager.get_sexual_orientation(session.username)
        .then((orientation) => {
            console.log(orientation)
            const sexual_orientation = SexualityManager.getMatchingOrientations(orientation);
            if (!sexual_orientation)
                throw e_error.NOT_FOUND
            const params = {
                username: session.username,
                sexual_orientations: sexual_orientation
            }
            return UserManager.match(params);
        })
        .then((users) => {
            console.log('ok')
            resolve(users);
        })
        .catch(reject);
    })
}