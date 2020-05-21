import db from '../database/db';
import { e_error } from './e_error';

export class UserManager {
    /**
     * get password by username
     * @param {string} username 
     */
    static getPassByUsername(username) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = { login: username }
            const cypher = "MATCH (n:User) WHERE n.username = {login} AND n.state IN [1, 2] RETURN n.password";

            session.run(cypher, params)
                .then((result) => {
                    session.close();

                    if (result.records.length < 1) throw e_error.NOT_FOUND;
                    const password = result.records[0].get('n.password');
                    resolve(password);
                })
                .catch(reject);
        })
    }

    /**
     * return if mail or username exist
     * @param {string} username 
     * @param {string} mail 
     */
    static userExist(username, mail) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                mail: mail
            }
            const cypher = "MATCH (n:User) WHERE n.username = {username} OR n.mail = {mail} RETURN n.mail, n.username";
            session.run(cypher, params)
                .then((result) => {
                    session.close();

                    if (result.records.length >= 1) {
                        const record = result.records[0];
                        if (record.has('n.username') && (record.get('n.username') == username))
                            return resolve(e_error.USERNAME_EXIST);
                        if (record.has('n.mail') && (record.get('n.mail') == mail))
                            return resolve(e_error.MAIL_EXIST);
                        return resolve('exist but ?');
                    }
                    resolve(null);
                })
                .catch(reject);
        })
    }

    /**
     * insert user
     * @param {string} username 
     * @param {string} password 
     * @param {string} mail 
     * @param {string} first_name 
     * @param {string} last_name 
     */
    static insert(username, password, mail, first_name, last_name) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                password: password,
                first_name: first_name,
                last_name: last_name,
                mail: mail,
                state: 0,
                creation_date: Date.now()
            }
            const cypher = "CREATE (a:User { username : {username} , password : {password}, first_name: {first_name}, last_name: {last_name}, mail: {mail}, state: {state}, creation_date: {creation_date} , popularity_score: toFloat(0), gender: '1', sexual_orientation: '2'} ) RETURN a, id(a) as nodeId";
            session.run(cypher, params)
                .then((result) => {
                    session.close();

                    resolve();
                })
                .catch(reject);
        })
    }

    /**
     * activate user account if state is 0
     * @param {string} username 
     */
    static activate_account(username) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username
            }
            const cypher = "MATCH (n:User) WHERE n.username = {username} AND n.state = 0 SET n.state = 1 RETURN n.username";
            session.run(cypher, params)
                .then((result) => {
                    session.close();
                    (result.summary.counters.propertiesSet() >= 1) ? resolve(true) : resolve(false);
                })
                .catch(reject);
        })
    }

    /**
     * update basic user info
     * @param {string} username 
     * @param {string} gender 
     * @param {string} sexual_orientation
     * @param {string} age
     * @param {string} biography 
     */
    static updateProfilInfo(username, gender, sexual_orientation, age, biography) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                gender: gender,
                sexual_orientation: sexual_orientation,
                age: age.toString(),
                biography: biography
            }
            const cypher = "MATCH (n:User) WHERE n.username = {username} SET n.gender = {gender}, n.sexual_orientation = {sexual_orientation}, n.age = toFloat({age}), n.biography = {biography}, n.state = toFloat(2) RETURN n.username";
            session.run(cypher, params)
                .then(() => {
                    session.close();
                    resolve();
                })
                .catch(reject);
        })
    }

    /**
     * update user full name
     * @param {string} username 
     * @param {string} first_name 
     * @param {string} last_name 
     */
    static updateFullName(username, first_name, last_name) {
        return new Promise((resolve, reject) => {
            const session = db.session()
            const params = {
                username: username,
                first_name: first_name,
                last_name: last_name
            }
            const cypher = "MATCH (n:User) WHERE n.username = {username} SET n.first_name = {first_name}, n.last_name = {last_name} RETURN n.username"
            session.run(cypher, params)
                .then(() => {
                    session.close();
                    resolve();
                })
                .catch(reject);
        })
    }

    /**
     * update user password
     * @param {string} username 
     * @param {string} password 
     */
    static updatePassword(username, password) {
        return new Promise((resolve, reject) => {
            const session = db.session()
            const params = {
                username: username,
                password: password
            }
            const cypher = "MATCH (n:User) WHERE n.username = {username} SET n.password = {password}"
            session.run(cypher, params)
                .then(() => {
                    session.close();
                    resolve();
                })
                .catch(reject);
        })
    }

    /**
     * return if mail exist
     * @param {string} mail 
     */
    static mailExist(mail) {
        return new Promise((resolve, reject) => {
            const session = db.session()
            const params = {
                mail: mail
            }
            const cypher = "MATCH (n:User) WHERE n.mail = {mail} RETURN n.username";
            session.run(cypher, params)
                .then((result) => {
                    session.close();
                    if (result.records.length >= 1)
                        return resolve(true);
                    resolve(false);
                })
                .catch(reject);
        })
    }

    /**
     * update user mail
     * @param {string} username 
     * @param {string} mail 
     */
    static updateMail(username, mail) {
        return new Promise((resolve, reject) => {
            const session = db.session()
            const params = {
                username: username,
                mail: mail
            }
            const cypher = "MATCH (n:User) WHERE n.username = {username} SET n.mail = {mail}"
            session.run(cypher, params)
                .then(() => {
                    session.close()
                    resolve()
                })
                .catch(reject)
        })
    }

    /**
     * update user resetcode for password
     * @param {string} username 
     * @param {string} reset_code 
     */
    static updateResetCode(username, reset_code) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                reset_code: reset_code
            }
            const cypher = "MATCH (n:User) WHERE n.username = {username} SET n.reset_code = {reset_code} RETURN n.mail";
            session.run(cypher, params)
                .then((results) => {
                    session.close();
                    if (results.records.length >= 1)
                        resolve(results.records[0].get('n.mail'))
                    else
                        resolve();
                })
                .catch(reject);
        })
    }

    /**
     * update user password if resetcode exist
     * @param {string} username 
     * @param {string} reset_code 
     * @param {string} password 
     */
    static updatePasswordByResetCode(username, reset_code, password) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                reset_code: reset_code,
                password: password
            }
            const cypher = "MATCH (n:User) WHERE n.username = {username} AND n.reset_code = {reset_code} SET n.password = {password} REMOVE n.reset_code";
            session.run(cypher, params)
                .then((results) => {
                    session.close();
                    (results.summary.counters.propertiesSet() >= 1) ? resolve(true) : resolve(false);
                })
                .catch(reject);
        })
    }

    /**
     * update user pic slot
     * @param {string} username 
     * @param {string} filename 
     * @param {string} slot 
     */
    static updateShowcasePic(username, filename, slot) {
        return new Promise((resolve, reject) => {
            const field_name = `profile_pic_${slot}`
            const session = db.session();
            const params = {
                username: username,
                filename: filename
            }
            const cypher = `
                MATCH (n:User)
                WHERE n.username = {username} 
                WITH n, n {.${field_name}} as old
                SET n.${field_name} = {filename}
                RETURN old.${field_name}`
            session.run(cypher, params)
                .then((results) => {
                    session.close();
                    const record = results.records[0];
                    if (record.has(`old.${field_name}`))
                        return resolve(record.get(`old.${field_name}`));
                    resolve()
                })
                .catch(reject);
        })
    }

    static updateGeo(username, lat, lon) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                lat: lat,
                lon: lon
            }
            const cypher = `
                MATCH(n: User)
                WHERE n.username = {username}
                SET n.localisation = point({
                    latitude: toFloat({lat}), 
                    longitude: toFloat({lon})
                })`;
            session.run(cypher, params)
                .then((results) => {
                    session.close();
                    resolve()
                })
                .catch(reject);
        })
    }

    /**
     * Return complete profil
     * @param {string} username
     */

    static getForValidation(username) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username
            };
            const cypher = `MATCH (n:User)
                            WHERE n.username = {username}
                            RETURN n.gender, n.sexual_orientation , n.age, n.biography, n.first_name, n.last_name, n.profile_pic_0, n.profile_pic_1, n.profile_pic_2, n.profile_pic_3, n.profile_pic_4`;
            session.run(cypher, params)
                .then((result) => {
                    session.close();
                    let records = result.records[0];
                    let content = {};
                    content.gender = (records.get('n.gender'));
                    content.sexual_orientation = (records.get('n.sexual_orientation'));
                    content.age = (records.get('n.age'));
                    content.biography = (records.get('n.biography'));
                    content.first_name = (records.get('n.first_name'));
                    content.last_name = (records.get('n.last_name'));
                    content.profile_pic_0 = (records.get('n.profile_pic_0'));
                    resolve(content);
                })
                .catch(reject)
        })
    }

    /**
     * full activate user account if state is 
     * @param {string} username 
     */
    static full_activate_account(username) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username
            }
            const cypher = "MATCH (n:User) WHERE n.username = {username} AND n.state = 1 SET n.state = 2 RETURN n.username";
            session.run(cypher, params)
                .then((result) => {
                    session.close();
                    (result.summary.counters.propertiesSet() >= 1) ? resolve(true) : resolve(false);
                })
                .catch(reject);
        })
    }

    /**
     * Report an account
     * @param {string} username_who_report
     * @param {string} username_reported
     * @param {string} flag_report 
     * FLAG REPORT : 1 - 3 ?? Create different relationships of REPORT from REPORT1 to REPORTX
     * 1 - Faux compte
     * 2 - Contenu inapproprié
     * 3 - Harcelement
     */

    static report_user(username_who_report, username_reported, flag) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                userwhoReport: username_who_report,
                userReported: username_reported,
                flag: flag,
                date: Date.now()
            };
            const cypher = "MATCH (n:User {username: {userwhoReport}}), (n2:User {username: {userReported}}) MERGE (n)-[:REPORT { reason: {flag} }]->(n2)";
            session.run(cypher, params)
                .then((result) => {
                    session.close();
                    resolve();
                })
                .catch(reject);
        })
    }

    /**
     * Recherche des utilisateurs en fonction de range age , range popularity score , distance , tags
     * @param {string} range_age_x
     * @param {string} range_age_y
     * @param {string} range_popularity_x
     * @param {string} range_popularity_y
     * @param {string} distance
     * @param {string} tags
     */

    static search_profiles(username, range_age_x, range_age_y, range_popularity_x, range_popularity_y, distance, tags) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                tags: tags,
                range_age_x: range_age_x,
                range_age_y: range_age_y,
                range_popularity_x: range_popularity_x,
                range_popularity_y: range_popularity_y,
                distance: distance * 1000
            };
            console.log(params);
            let cypher = `  
                MATCH (n:User)
                WHERE n.username = {username}
                WITH n.localisation as point_ref
                MATCH (n:User),(n)-[l:LIKE]->(t:Tag)
                WHERE t.name IN {tags}
                AND n.age >= toInt({range_age_x}) AND n.age <= toInt({range_age_y})
                AND n.popularity_score >= toFloat({range_popularity_x}) AND n.popularity_score <= toFloat({range_popularity_y})
                AND distance(point_ref, n.localisation) <= toFloat({distance})
                AND n.username <> {username}
                AND NOT (:User {username: {username} })-[:BLOCKED]-(n)
                RETURN n.username as username, n.first_name as first_name, n.last_name as last_name, n.age as age,
                ROUND((DISTANCE(point_ref, n.localisation)) / 1000) AS distance, n.popularity_score as popularity_score,
                collect(t.name) as tags, n.profile_pic_0 AS profile_pic`;

            if (params.tags == null) {
                console.log('using search without tags')
                cypher = `
                MATCH (n:User)
                    WHERE n.username = {username}
                    WITH n.localisation as point_ref
                MATCH (n:User)
                    WHERE n.age >= toInt({range_age_x}) AND n.age <= toInt({range_age_y})
                    AND n.popularity_score >= toFloat({range_popularity_x}) AND n.popularity_score <= toFloat({range_popularity_y})
                    AND distance(point_ref, n.localisation) <= toFloat({distance})
                    AND n.username <> {username}
                    AND NOT (:User {username: {username} })-[:BLOCKED]-(n)
                    RETURN n.username as username, n.first_name as first_name, n.last_name as last_name, n.age as age,
                    ROUND((DISTANCE(point_ref, n.localisation)) / 1000) AS distance, n.popularity_score as popularity_score,
                    n.profile_pic_0 AS profile_pic`
            }

            session.run(cypher, params)
                .then((result) => {
                    session.close();
                    const data = result.records.map((user) => user.toObject())
                    resolve(data);
                })
                .catch(reject);
        })
    }

    /**
     * Bloquer un utilisateur
     * @param {string} username
     * @param {string} username_blocked
     */

    static block_user(username, username_blocked) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                username_blocked: username_blocked
            };
            const cypher = `
                MATCH (n:User {username: {username}}),(n2:User {username: {username_blocked}})
                MERGE (n)-[:BLOCKED]->(n2)`;
            const delete_relationships = `
            MATCH (n: User {username: {username} }), (n2: User { username: {username_blocked} })
            OPTIONAL MATCH (n)-[c:CHAT_IN]->(r:Room)<-[c2:CHAT_IN]-(n2)
            OPTIONAL MATCH (r)-[msg_r:MESSAGE_IN]-(msg:Message)
            OPTIONAL MATCH (n)-[a:LIKE]-(n2)
            OPTIONAL MATCH (n)-[v:VISITED]-(n2)
            DELETE c, r, c2, r, msg_r, msg, a, v`
            session.run(cypher, params)
                .then(() => {
                    return session.run(delete_relationships, params)
                })
                .then(() => {
                    session.close();
                    resolve()
                })
                .catch(reject);
        })
    }

    /**
     * Verifier si un user est bloqué par un autre
     * @param {string} username1
     * @param {string} username2
     */

    static isBlockedUser(username1, username2) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username1: username1,
                username2: username2
            };
            const cypher = `MATCH (n:User {username: {username1} })<-[b:BLOCKED]->(n2:User{username: {username2} })
            RETURN COUNT(b) > 0 AS blocked`;
            session.run(cypher, params)
                .then((result) => {
                    session.close();
                    let blocked = result.records[0].get('blocked');
                    resolve(blocked);
                })
                .catch(reject)
        })
    }


    static getUserProfile(username, username_visitor) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                username_visitor: username_visitor
            }
            const returnMail = username === username_visitor ? ',n.mail AS mail' : '';
            const cypher = `
                MATCH (n:User)
                WHERE n.username = {username}
                OPTIONAL MATCH (b:User { username: {username_visitor} })-[l:LIKE]->(n)
                OPTIONAL MATCH (n)-[ly:LIKE]->(c:User { username: {username_visitor} })
                OPTIONAL MATCH (n)-[:LIKE]->(t:Tag)
                RETURN n.gender AS gender, n.sexual_orientation AS sexual_orientation, n.biography AS biography,
                n.username AS username, n.age AS age, n.first_name AS first_name, n.last_name AS last_name,
                n.profile_pic_0 AS profile_pic_0, n.profile_pic_1 AS profile_pic_1, n.profile_pic_2 AS profile_pic_2,
                n.profile_pic_3 AS profile_pic_3, n.profile_pic_4 AS profile_pic_4, n.popularity_score AS popularity_score,
                n.last_seen AS last_seen, COUNT(l) > 0 AS liked, COUNT (ly) > 0 AS liked_you, COLLECT(t.name) AS tags,
                ROUND((DISTANCE(n.localisation, b.localisation)) / 1000) AS distance${returnMail}`;
            session.run(cypher, params)
                .then((results) => {
                    session.close();
                    if (results.records.length < 1)
                        return reject(e_error.NOT_FOUND);
                    const u = results.records[0].toObject();
                    resolve(u);
                })
                .catch(reject);
        })
    }


    static historicAddProfileVisit(visitor_username, username) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                visitor_username: visitor_username,
                date: Date.now()
            };
            const cypher = `MATCH (a:User),(b:User)
            WHERE a.username = {visitor_username} AND b.username = {username}
            MERGE (a)-[r:VISITED]->(b)
            SET r.date = {date}
            RETURN type(r)`
            session.run(cypher, params)
                .then(() => {
                    session.close();
                    resolve();
                })
                .catch(reject);
        })
    }

    static likeUser(username, username_to_like) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                username_to_like: username_to_like,
                date: Date.now()
            };
            const cypher = `
                MATCH 
                    (a:User { username: {username} }),
                    (b:User { username: {username_to_like} })
                WHERE (EXISTS(a.profile_pic_0)
                OR EXISTS(a.profile_pic_1)
                OR EXISTS(a.profile_pic_2)
                OR EXISTS(a.profile_pic_3) 
                OR EXISTS(a.profile_pic_4))
                OPTIONAL MATCH (b)-[l:LIKE]->(a)
                MERGE (a)-[r:LIKE]->(b)
                SET r.date = {date}
                RETURN COUNT(l) > 0 AS like_you`
            session.run(cypher, params)
                .then((res) => {
                    session.close();
                    if (res.summary.counters.relationshipsCreated() != 1)
                        throw e_error.CANNOT_LIKE;
                    resolve(res.records[0].get('like_you'));
                })
                .catch(reject);
        })
    }

    static unlikeUser(username, username_to_unlike) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                username_to_unlike: username_to_unlike,
                date: Date.now()
            };
            const cypher = `
                    MATCH 
                    (n:User { username: {username} })-[r:LIKE]->(b:User { username: {username_to_unlike} })
                    OPTIONAL MATCH (b:User { username: {username_to_unlike} })-[l:LIKE]->(n)
                    DELETE r
                    RETURN COUNT(l) > 0 AS liked_you`
            session.run(cypher, params)
                .then((res) => {
                    session.close();
                    if (res.summary.counters.relationshipsDeleted() <= 0)
                        throw e_error.CANNOT_UNLIKE
                    resolve(res.records[0].get('liked_you'));
                })
                .catch(reject);
        })
    }

    static getVisitHistory(username) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username
            }
            const cypher = `
                    MATCH (n:User)-[v:VISITED]->(b:User {username: {username} })
                    RETURN n.username AS username, v.date AS visited_date, n.profile_pic_0 AS profile_pic
                    ORDER BY v.date DESC LIMIT 15
                `
            session.run(cypher, params)
                .then((results) => {
                    session.close();
                    const data = results.records.map(el => el.toObject());
                    resolve(data);
                })
                .catch(reject);
        })
    }

    static getLikeHistory(username) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username
            }
            const cypher = `
                    MATCH (n:User)-[l:LIKE]->(b:User {username: {username} })
                    RETURN n.username AS username, l.date AS liked_date, n.profile_pic_0 AS profile_pic
                    ORDER BY l.date DESC LIMIT 15`;
            session.run(cypher, params)
                .then((results) => {
                    session.close();
                    const data = results.records.map(el => el.toObject());
                    resolve(data);
                })
                .catch(reject);
        })
    }

    static getLikesAndVisits(users) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                users: users
            }
            const cypher = `
                    MATCH (n: User)<-[r:LIKE]-()
                    WHERE n.username
                    IN {users}
                    RETURN n.username AS username, toString(COUNT(r)) AS likes, toString(0) AS visits
                    UNION ALL
                    MATCH (n: User)<-[b:VISITED]-()
                    WHERE n.username
                    IN {users}
                    RETURN n.username AS username, toString(0) AS likes, toString(COUNT(b)) AS visits
                `
            session.run(cypher, params)
                .then((results) => {
                    session.close();
                    const data = results.records.map((user) => user.toObject())
                    resolve(data);
                })
                .catch(reject);
        })
    }

    static updateUsersPopularityScore(users) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                data: users
            };
            const cypher = `
                    UNWIND {data} AS d
                    MATCH (n: User { username: d.username })
                    SET n.popularity_score = d.popularity_score`
            session.run(cypher, params)
                .then(() => {
                    session.close();
                    resolve();
                })
                .catch(reject);
        })
    }

    static get_sexual_orientation(username) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username
            }
            const cypher = `MATCH (n: User { username: {username} }) RETURN n.sexual_orientation`;
            session.run(cypher, params)
                .then((results) => {
                    if (results.records.length <= 0)
                        throw e_error.NOT_FOUND;
                    if (!results.records[0].has('n.sexual_orientation'))
                        throw e_error.NOT_FOUND;
                    resolve(results.records[0].get('n.sexual_orientation'))
                })
                .catch(reject);
        })
    }

    static match(data) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: data.username,
                sexual_orientations: data.sexual_orientations
            }
            const cypher = `
                MATCH (n: User { username: {username}, state: 2 })-[:LIKE]->(t: Tag)<-[:LIKE]-(b: User)
                WHERE b.sexual_orientation IN {sexual_orientations}
                AND NOT (n)<-[:BLOCKED]->(b)
                RETURN
                    COLLECT(t.name) as tag,
                    b.username AS username,
                    b.first_name AS first_name,
                    b.last_name AS last_name,
                    b.popularity_score AS popularity_score,
                    b.sexual_orientation AS sexual_orientation,
                    ROUND((DISTANCE(n.localisation, b.localisation)) / 1000) AS distance,
                    b.age AS age,
                    b.profile_pic_0 AS profile_pic
                ORDER BY distance, SIZE(COLLECT(t.name)) DESC, popularity_score DESC
                LIMIT 15
            `
            session.run(cypher, params)
                .then((results) => {
                    session.close();
                    const users = results.records.map((el) => el.toObject());
                    resolve(users);
                })
                .catch(reject);
        })
    }

    static updateLastSeen(username) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                date: Date.now()
            }
            const cypher = `MATCH (n: User) WHERE n.username = {username} SET n.last_seen = {date}`
            session.run(cypher, params)
                .then(() => {
                    session.close();
                    resolve();
                })
                .catch(reject)
        })
    }

}