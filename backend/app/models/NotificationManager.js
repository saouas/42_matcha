import db from '../database/db';
import { e_error } from './e_error';
export class NotificationManager {

    /** Set notifications in databse
     * 
     * @param {string} username 
     * @param {string} username_pointed 
     * @param {string} reason 
     */
    static setNotifications(username, username_pointed, reason) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                username_pointed: username_pointed,
                reason: reason,
                date: Date.now()
            };
            const cypher = `CREATE (n: Notification {username: {username}, username_pointed: {username_pointed}, reason: {reason}, date:{date} })`;
            session.run(cypher, params)
            .then((result) => {
                session.close();
                resolve();
            })
            .catch(reject)
        })
    }

    static getNotifications(username) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
            };
            const cypher = `MATCH (n: Notification) WHERE n.username = {username} RETURN n.date AS date, n.reason AS type, n.username_pointed AS username ORDER BY date DESC`;
            session.run(cypher, params)
            .then((result) => {
                session.close();
                const data = result.records.map((el) => el.toObject());
                resolve(data);
            })
            .catch(reject)
        })
    }

    static clearNotifications(username) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
            };
            const cypher = `MATCH (n: Notification) WHERE n.username = {username} DELETE n`;
            session.run(cypher, params)
            .then(() => {
                session.close();
                resolve();
            })
            .catch(reject)
        })
    }

    static countNotifications(username) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
            };
            const cypher = `MATCH (n: Notification) WHERE n.username = {username} RETURN toFloat(COUNT (n.username)) AS count`;
            session.run(cypher, params)
            .then((res) => {
                session.close();
                if (res.records.length < 1)
                    throw e_error.NOT_FOUND;
                resolve(res.records[0].toObject());
            })
            .catch(reject)
        })
    }

}
