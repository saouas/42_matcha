import db from '../database/db';

export class TagManager {
    /**
     * creating tag if not exist
     * @param {string} name tag name
     */
    static createTagIfNotExist(name) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                name: name
            }
            const cypher = "MERGE (t:Tag { name: {name} })";
            session.run(cypher, params)
            .then(() => {
                session.close();
                resolve();
            })
            .catch(reject);
        })
    }

    /**
     * create relationship between User and Tag
     * User -[LIKE]-> Tag
     * @param {string} username username
     * @param {string} tagName tag name
     */
    static createUserLike(username, tagName) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                tag: tagName
            }
            const cypher = `
                MATCH (n:User), (t:Tag) 
                WHERE n.username = {username} AND t.name = {tag}
                MERGE (n)-[l:LIKE]->(t)
                RETURN type(l)
            `;
            session.run(cypher, params)
            .then((results) => {
                session.close();
                resolve();
            })
            .catch(reject);
        })
    }

    static removeUserLike(username, tagName) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const params = {
                username: username,
                tag: tagName
            }
            const cypher = `
                MATCH (n:User {username: {username} })-[l:LIKE]->(t:Tag { name: {tag} }) DELETE l
            `;
            session.run(cypher, params)
            .then((results) => {
                session.close();
                resolve();
            })
            .catch(reject);
        })
    }

    static getMostPopular() {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const cypher = `
                MATCH (n: User)-[l:LIKE]->(t:Tag) RETURN COUNT(l) AS n, t.name AS name ORDER BY COUNT(l) DESC LIMIT 8
            `;
            session.run(cypher)
            .then((results) => {
                session.close();
                const tab = results.records.map((el) => el.get('name'))
                resolve(tab);
            })
            .catch(reject);
        })
    }
    
    static search(name) {
        return new Promise((resolve, reject) => {
            const session = db.session();
            const cypher = `
                MATCH (t:Tag) WHERE t.name =~ '${name}.*' return t.name LIMIT 5
            `;
            session.run(cypher)
            .then((results) => {
                session.close();
                const tab = results.records.map((el) => el.get('t.name'))
                resolve(tab);
            })
            .catch(reject);
        })
    }
}