const db = require(`${__dirname}/../connection.js`)

exports.fetchTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then(({rows})=>{
        console.log(rows, "<--- rows in models?")
        return rows
    })
}