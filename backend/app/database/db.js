const neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://db:7687", neo4j.auth.basic("neo4j", "neo4j123"));

const user_unique = "CREATE CONSTRAINT ON (n:User) ASSERT n.username IS UNIQUE";
const notification_index = "CREATE INDEX ON :Notification(username)"

const create_constraints = () => {
    const session = driver.session();
    
    session.run(user_unique)
    .then((result) => {
        (result.summary.counters.constraintsAdded() >= 1) ? console.log('constraints created') : console.log('constraints already created');
        return session.run(notification_index)
    })
    .then((result) => {
        (result.summary.counters.indexesAdded() >= 1) ? console.log('index created on notification (username)') : console.log('index notification already created');
        session.close();
    })
    .catch(() => {
        console.log('database error');
        setTimeout(create_constraints, 5000)
    })
}

create_constraints();

export default driver;