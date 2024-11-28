const db = require(`${__dirname}/../connection.js`)

exports.fetchTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then(({rows})=>{
        return rows
    })
}

exports.fetchArticleById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result)=>{
        if (result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'Article not found'})
        }
        return result.rows[0]
    })
}

exports.fetchArticles = (sort_by, order, topic) => {
    if (topic) {
        return db
        .query(`SELECT * FROM articles
            WHERE articles.topic = $1`, [topic])
            .then(({rows}) => {
                return rows
            })
        }

    
    if (!sort_by && !order && !topic) {
        return db
        .query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY 
        articles.article_id
        ORDER BY articles.created_at DESC;`)
        .then(({rows})=>{
            return rows
        })
    } else {
        let queryStr = (`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY 
        articles.article_id`)

        const validSortingInputs = [
            "article_id",
            "title",
            "topic",
            "author",
            "created_at",
            "votes",
            "comment_count",
            "article_img_url"
        ]

        const validOrderingInputs = [
            "asc",
            "desc",
        ]

        if (sort_by && !validSortingInputs.includes(sort_by)) {
            return Promise.reject({status:400, msg: "Bad request"})
        }

        if(order && !validOrderingInputs.includes(order)) {
            return Promise.reject({status:400, msg: "Bad request"})
        }

        if (sort_by && order) {
            queryStr += ` ORDER BY ${sort_by} ${order}`
        }
        else if (sort_by) {
            queryStr += ` ORDER BY ${sort_by} DESC`
        }
        else if (order) {
            queryStr += ` ORDER BY created_at ${order}`
        }
        return db.query(queryStr).then(({rows}) => {
            return rows
        })
        }
}

exports.fetchCommentsByArticleId = (article_id) => {
    return db
    .query(`SELECT * FROM comments
        WHERE comments.article_id = $1
        ORDER BY comments.created_at DESC;`, [article_id])
        .then(({rows})=>{
            return rows
        })
}

exports.insertCommentByArticleId = (article_id, comment) => {
    const {username, body} = comment
    return db.query(`INSERT INTO comments(author, body, article_id) VALUES($1, $2, $3) RETURNING *`, [username, body, article_id])
    .then(({rows})=>{
        return rows[0]
    })
}

exports.updateVotesByArticleId = (article_id, vote) => {
    const newVote = vote.inc_votes
    return db.query(`UPDATE articles SET votes = (votes+$2) WHERE article_id = $1 RETURNING *`, [article_id, newVote])
    .then(({rows})=> {
        if (!rows.length){
            return Promise.reject({status:404, msg: 'Article not available or does not exist'})
        }
        return rows[0]
    })
}

exports.removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments
        WHERE comment_id = $1 RETURNING *`, [comment_id])
        .then(({rows})=>{
        if (!rows.length) {
            return Promise.reject({status: 404,
                msg: 'Comment not available or does not exist'
            })
        }
            return rows
        })
}

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then(({rows}) => {
        return rows
    })
}