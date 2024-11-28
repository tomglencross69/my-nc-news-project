const db = require(`${__dirname}/../connection.js`)

exports.checkTopicExists = (topic) => {
         return db
        .query(`SELECT * FROM articles
            WHERE topic = $1`, [topic])
        .then(({rows})=> {
            if (!rows.length){
                return Promise.reject({status: 404,
                    msg: 'Topic not available or does not exist'
                })
            }
        })
    }
    