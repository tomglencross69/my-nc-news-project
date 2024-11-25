const endpointsJson = require(`${__dirname}/../../endpoints.json`)
const {fetchTopics, fetchArticleById, fetchArticles, fetchCommentsByArticleId} = require(`${__dirname}/../models/app.models.js`)

exports.getApi = (request, response) => {
    response.status(200).send({endpoints: endpointsJson});
  }

exports.getTopics = (request, response, next) => {
    fetchTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
    .catch(next)
}

exports.getArticleById = (request, response, next) => {
    const {article_id} = request.params
    fetchArticleById(article_id)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch(next)
}

exports.getArticles = (request, response, next) => {
    fetchArticles()
    .then((articles) => {
        response.status(200).send({articles})
    })
    .catch(next)
}

exports.getCommentsByArticleId = (request, response, next) => {
    const {article_id} = request.params
    fetchCommentsByArticleId(article_id)
    .then((comments)=>{
        response.status(200).send({comments})
    })
    .catch(next)
}