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

exports.fetchArticles = () => {
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