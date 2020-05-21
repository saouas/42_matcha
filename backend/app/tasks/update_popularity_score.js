import crontab from 'node-cron';
import { UserManager } from '../models/UserManager';

const like_weight_g = 0.55;
const visit_weight_g = 0.08;

const parts = [
    [50, 0.75],
    [100, 0.50],
    [200, 0.25],
    [Infinity, 0.18]
]

let user_to_update = [];

export const add_user_to_update = (username) => {
    if (!user_to_update.includes(username))
        user_to_update.push(username);
}

const calc_popularity_score = (likes, visits) => {
    let popularity_score = 0;

    const _calc_likes = (likes * like_weight_g);
    const _calc_visits = (visits * visit_weight_g);
    const total = _calc_likes + _calc_visits;

    // console.log(`_calc_likes: ${_calc_likes} _calc_visits: ${_calc_visits} total ${total}`)

    const t_determinor = likes + visits;

    let tranch_weight = 0;
    let old_tranch = 0;
    for (let i = 0; i < parts.length; i++) {
        const el = parts[i];
        if (t_determinor <= el[0] && t_determinor >= old_tranch) {
            tranch_weight = el[1];
            old_tranch = el[0];
        }
    }

    // console.log('t_determinor: ' + t_determinor + '|  tranch weight:' + tranch_weight);

    popularity_score = (total * (tranch_weight));
    if (popularity_score > 10)
        popularity_score = 10;
    return popularity_score;
}

const process_update_score = () => {
    let users = new Map();
    if (user_to_update.length === 0)
        return console.log('no popularity score to update..');
    UserManager.getLikesAndVisits(user_to_update)
    .then((freshUsers) => { // add request in a tab
        freshUsers.forEach(user => {
            if (!users.has(user.username))
                users.set(user.username, [Number(user.likes), Number(user.visits)]);
            else {
                const old = users.get(user.username);
                users.set(user.username, [old[0] + Number(user.likes), old[1] + Number(user.visits)]);
            }

            if (user_to_update.indexOf(user.username) !== -1)
                user_to_update.splice(user_to_update.indexOf(user.username), 1);
        });
    })
    .then(() => { // check remaining users
        user_to_update.forEach((user) => {
            users.set(user, [0, 0])
        })
        user_to_update = [];
    })
    .then(() => { // process calc user popularity_score
        let toUpdate = [];
        users.forEach((user, username) => {
            const popularity_score = calc_popularity_score(user[0], user[1]);
            toUpdate.push({
                username: username,
                popularity_score: popularity_score
            })
            // console.log(popularity_score);
            // console.log(`${username} ${user[0]} ${user[1]}\n`)
        })
        return UserManager.updateUsersPopularityScore(toUpdate)
    })
    .then(() => {
        console.log('popularity score updated..')
    })
    .catch((err) => {
        console.log('err process_update_score', err);
    })
}

crontab.schedule('* * * * *', process_update_score)

/** 
const test = [
    [80, 500],
    [2, 150],
    [14, 39],
    [50, 120],
    [4, 2],
    [34, 70],
    [6, 10]
]

test.forEach((user) => {
    const popularity_score = calc_popularity_score(user[0], user[1]);
    console.log(`score: ${popularity_score} | ${user[0]} likes | ${user[1]} visits`);
    console.log("\n");
})
*/