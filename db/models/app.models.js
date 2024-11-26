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