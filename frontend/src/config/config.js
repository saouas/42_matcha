export const endpoint = process.env.ENDPOINT || 'http://localhost:8080';
const config = {
    login: `${endpoint}/auth/login`,
    register: `${endpoint}/auth/register`,
    profile: `${endpoint}/user/update_profile_info`,
    popular_tag: `${endpoint}/user/tag/popular`,
    search_tag: `${endpoint}/user/tag/search`,
    add_tag: `${endpoint}/user/tag/add`,
    remove_tag: `${endpoint}/user/tag/remove`,
    update_fullname: `${endpoint}/user/update_fullname`,
    update_mail: `${endpoint}/user/update_mail`,
    update_password: `${endpoint}/user/update_password`,
    show_user_profile: `${endpoint}/user/show_user_profile`,
    like_user: `${endpoint}/user/like`,
    unlike_user: `${endpoint}/user/unlike`,
    history: `${endpoint}/user/visit_history`,
    like_history: `${endpoint}/user/like_history`,
    report_user: `${endpoint}/user/report_user`,
    block_user: `${endpoint}/user/block_user`,
    update_localisation: `${endpoint}/user/update_localisation`,
    update_profile_info: `${endpoint}/user/update_profile_info`,
    update_pic: `${endpoint}/user/update_profile_pic`,
    notifications: `${endpoint}/user/notifications`,
    clear_notifications: `${endpoint}/user/notifications/clear`,
    count_notifications: `${endpoint}/user/notifications/count`,
    match: `${endpoint}/user/match`,
    search: `${endpoint}/user/recherche`,
    reset_password: `${endpoint}/auth/reset_password`,
    ask_reset_password: `${endpoint}/auth/ask_reset_password`,
}

export const profile_pictures_url = `${endpoint}/public/profile_pictures`

export default config;