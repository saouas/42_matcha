export const e_notification_type = {
    LIKE_YOU: 1,
    VISIT_YOU: 2,
    RECEIVE_MESSAGE: 3,
    MATCH_LIKE: 4,
    MATCH_UNLIKE: 5
}

let tab = new Map();

for (let [key, value] of Object.entries(e_notification_type)) {
    tab.set(value, key);
}

export const get_notification_type = (number) => tab.get(number);