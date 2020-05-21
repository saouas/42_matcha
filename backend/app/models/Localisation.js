import axios from 'axios';
import { e_error } from './e_error';

export class Localisation {
    static search(user_ip) {
        return new Promise((resolve, reject) => {
            axios.get(`https://api.ipgeolocationapi.com/geolocate/${user_ip}`)
            .then((res) => {
                resolve({
                    lat: res.data.geo.latitude,
                    lon: res.data.geo.longitude
                })
            })
            .catch(() => {
                reject(e_error.CANNOT_LOCALISE)
            });
        })
    }
}