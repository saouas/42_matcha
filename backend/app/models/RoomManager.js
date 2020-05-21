import uuid from 'uuid/v4';
import db from '../database/db';
import { e_error } from './e_error';

class RoomManager {
    static insertRoom(username1, username2) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                uid: uuid(),
                username1: username1,
                username2: username2
            }
            const cypher = `
                MERGE (r: Room { uid: {uid} })
                WITH r AS r
                MATCH 
                    (n: User { username: {username1} }),
                    (b: User { username: {username2} })
                MERGE (n)-[:CHAT_IN]->(r)
                MERGE (b)-[:CHAT_IN]->(r)
            `
            session.run(cypher, params)
            .then((res) => {
                session.close();
                if (res.summary.counters.nodesCreated() == 0)
                    throw (e_error.ROOM_NOT_CREATED)
                resolve(params.uid);
            })
            .catch(reject);
        })
    }

    static removeRoom(username1, username2) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username1: username1,
                username2: username2
            }
            const cypher = `
                MATCH (n: User {username: {username1} })-[c:CHAT_IN]->(r:Room)<-[c2:CHAT_IN]-(n2: User { username: {username2} })
                OPTIONAL MATCH (r)-[msg_r:MESSAGE_IN]-(msg:Message)
                DELETE c, r, c2, r, msg_r, msg`
            session.run(cypher, params)
            .then((res) => {
                session.close();
                if (res.summary.counters.nodesDeleted() == 0)
                    throw (e_error.ROOM_NOT_DELETED)
                resolve();
            })
            .catch(reject);
        })
    }

    static insertMessage(username_to, username_from, text) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username_to: username_to,
                username_from: username_from,
                text: text,
                date: Date.now()
            }
            const cypher = `
                MATCH (n: User {username: {username_from} })-[c:CHAT_IN]->(r:Room)<-[c2:CHAT_IN]-(n2: User { username: {username_to} })
                CREATE 
                    (m: Message { username: {username_from}, text: {text}, date: {date} })-[:MESSAGE_IN]->(r)
            `
            session.run(cypher, params)
            .then((res) => {
                session.close();
                if (res.summary.counters.nodesCreated() == 0)
                    throw e_error.MSG_NOT_SENT;
                resolve();
            })
            .catch(reject);
        })
    }

    static getOldMessages(username1, username2) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username1: username1,
                username2: username2
            }
            const cypher = `
                    MATCH (n: User { username: {username1} })-[:CHAT_IN]->(r: Room)<-[:CHAT_IN]-(b: User { username: {username2} })
                    MATCH (m:Message)-[:MESSAGE_IN]->(r)
                    RETURN m.date AS date, m.text AS text, m.username AS username`
            session.run(cypher, params)
            .then((res) => {
                session.close()
                const data = res.records.map((el) => el.toObject());
                resolve(data);
            })
            .catch(reject)
        })
    }
}

export { RoomManager }