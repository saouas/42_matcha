import { UserManager } from '../../models/UserManager';
import bcrypt from 'bcryptjs';
import { TagManager } from '../../models/TagManager'
import { add_user_to_update } from '../../tasks/update_popularity_score';

let usernames = [];
let tags = ['vegan', 'love', 'music', 'algerie', 'jeux', 'drogue', 'dance'];
export const populate_db = () => {
    console.log("**************** SUCCESS DB POPULATED *****************");
    return new Promise((resolve, reject) => {
        const nb_users = 1000;
        let count = 0;

        const create_string = (char_allowed) => {
            let length = Math.floor(Math.random() * (5 - 10 + 1)) + 10;
            let result = '';
            let charactersLength = char_allowed.length;
            for (var i = 0; i < length; i++) {
                result += char_allowed.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        TagManager.createTagIfNotExist('vegan')
        TagManager.createTagIfNotExist('love')
        TagManager.createTagIfNotExist('music')
        TagManager.createTagIfNotExist('algerie')
        TagManager.createTagIfNotExist('jeux')
        TagManager.createTagIfNotExist('drogue')
        TagManager.createTagIfNotExist('dance')
        const create_user = () => {

            let username = create_string('abcdefghijklmnopqrstuvwxyz');
            usernames.push(username);
            let password = "testTEST2@";
            password = bcrypt.hashSync(password, 2);
            let first_name = create_string('abcdefghijklmnopqrstuvwxyz');
            let last_name = create_string('abcdefghijklmnopqrstuvwxyz');
            let email = create_string('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890') + '@' + 'live.fr';


            UserManager.insert(username, password, email, first_name, last_name)
                .then(() => {
                    UserManager.updateShowcasePic(username, 'minions', 0)
                        .then(() => {
                            let age = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
                            let gender = (Math.floor(Math.random() * (2 - 1 + 1)) + 1).toString();
                            let bio = create_string('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ');
                            let orientation = 0;
                            if (gender == 1) {
                                orientation = (Math.floor(Math.random() * (3 - 1 + 1)) + 1).toString();
                            }
                            else {
                                orientation = (Math.floor(Math.random() * (6 - 4 + 1)) + 4).toString();
                            }
                            UserManager.updateLastSeen(username).catch(console.log);
                            UserManager.updateProfilInfo(username, gender, orientation, age, bio)
                                .then(() => {
                                    UserManager.updateGeo(username, -1.74922 + (Math.random() * 10), 1.152695999999992 + (Math.random() * 10))
                                    if (usernames.length > 20) {
                                        let item1 = usernames[Math.floor(Math.random() * usernames.length)];
                                        for (var i = 0; i < 9; i++) {
                                            if (Math.random() >= 0.2) {
                                                let item2 = usernames[Math.floor(Math.random() * usernames.length)];
                                                UserManager.likeUser(item1, item2)
                                                    .catch(console.log)
                                                UserManager.historicAddProfileVisit(item1, item2)
                                                    .catch(console.log)
                                                TagManager.createUserLike(item1, tags[Math.floor(Math.random() * tags.length)])
                                                    .catch(console.log)
                                                add_user_to_update(item1);
                                                add_user_to_update(item2);
                                            } 
                                        }
                                    }
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        })
                })
                .catch(reject)
        }

        while (count < nb_users) {
            setTimeout(create_user, count * 50)
            count++;
        }
        console.log("**************** SUCCESS DB POPULATED *****************");
        resolve();
    })



}