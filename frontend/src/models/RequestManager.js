import axios from 'axios';
import config from '../config/config';
import { AuthManager } from './AuthManager';
import history from './history';
import { NotificationManager } from 'react-notifications';

const _axios = axios.create();

_axios.interceptors.request.use((config) => {
    config.headers['Authorization'] = AuthManager.getToken();
    return config;
}, (err) => {
    return Promise.reject(err);
})

const authErr = (err) => {
    if (err.response.status === 401) {
        console.log('auth error')
        AuthManager.disconnect();
        NotificationManager.error('Veuillez vous reconnecter')
        history.push('/login');
    }
    return Promise.reject(err);
}

const RequestManager = {
    getUserData: () => {
        return new Promise((resolve, reject) => {
            resolve({
                first_name: 'marco',
                last_name: 'KIRIKO',
                mail: 'ark@arkan.fr'
            })
        })
    },

    getUserProfile: (username) => {
        return _axios.get(config.show_user_profile, {
            params: {
                username: username
            }
        })
        .catch(authErr);
    },

    updateFullName: (first_name, last_name) => {
        return _axios.post(config.update_fullname, {
            first_name: first_name,
            last_name: last_name
        })
        .catch(authErr)
    },

    updateMail: (mail) => {
        return _axios.post(config.update_mail, {
            mail: mail
        })
        .catch(authErr);
    },

    updatePassword: (old_password, new_password) => {
        return _axios.post(config.update_password, {
            old_password: old_password,
            new_password: new_password
        })
        .catch(authErr);
    },

    likeUser: (username) => {
        return _axios.post(config.like_user, {
            username: username
        }).catch(authErr);
    },

    unlikeUser: (username) => {
        return _axios.post(config.unlike_user, {
            username: username
        }).catch(authErr);
    },

    getHistory: () => {
        return _axios.get(config.history)
        .catch(authErr);
    },

    getLikeHistory: () => {
        return _axios.get(config.like_history)
        .catch(authErr);
    },

    reportUser: (reported, report_flag) => {
        return _axios.post(config.report_user, {
            reported: reported,
            report_flag: report_flag
        })
        .catch(authErr)
    },

    blockUser: (username) => {
        return _axios.post(config.block_user, {
            username: username
        })
        .catch(authErr)
    },

    updateLocalisation: (latitude, longitude) => {
        return _axios.post(config.update_localisation, {
            lat: latitude,
            lon: longitude
        })
        .catch(authErr)
    },

    getPopularTags: () => {
        return _axios.get(config.popular_tag)
        .catch(authErr)
    },

    searchTags: (name) => {
        return _axios.get(config.search_tag, {
            params: {
                name: name
            }
        })
        .catch(authErr);
    },

    addTag: (name) => {
        return _axios.post(config.add_tag, {
            name: name
        })
        .catch(authErr)
    },
    removeTag: (name) => {
        return _axios.post(config.remove_tag, {
            name: name
        })
        .catch(authErr);
    },
    updateProfile: (gender, sexual_orientation, biography, age) => {
        return _axios.post(config.update_profile_info, {
            gender: gender,
            sexual_orientation: sexual_orientation,
            biography: biography,
            age: age
        })
        .catch(authErr);
    },

    match: () => {
        return _axios.get(config.match)
        .catch(authErr)
    },
    
    search: (range_age, range_popularity_score, distance, tags) => {
        return _axios.post(config.search, {
            range_age: range_age,
            range_popularity_score: range_popularity_score,
            distance: distance,
            tags: tags
        })
        .catch(authErr);
    },
    updatePic: (slot, data) => {
        return _axios.post(config.update_pic, data, {
            params: {
                slot: slot
            }
        })
    },
    resetPassword: (token, password) => {
        return axios.post(config.reset_password, {
            token: token,
            password: password
        })
        .catch(authErr);
    },

    getNotifications: () => {
        return _axios.get(config.notifications)
        .catch(authErr);
    },

    clearNotifications: () => {
        return _axios.post(config.clear_notifications)
        .catch(authErr);
    },

    countNotifications: () => {
        return _axios.get(config.count_notifications)
        .catch(authErr);
    }
}

export { RequestManager };