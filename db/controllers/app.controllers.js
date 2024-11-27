const { request, response } = require("../app");

const endpointsJson = require(`${__dirname}/../../endpoints.json`)
const {fetchTopics, fetchArticleById, fetchArticles, fetchCommentsByArticleId, insertCommentByArticleId, updateVotesByArticleId, removeComment} = require(`${__dirname}/../models/app.models.js`)

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

exports.postCommentsByArticleId = (request, response, next) => {
    const {article_id} = request.params
    const comment = request.body
    insertCommentByArticleId(article_id, comment)
    .then((comment) => {
        response.status(201).send({comment})
    })
    .catch(next)
}

exports.patchVotesByArticleId = (request, response, next) => {
    const {article_id} = request.params
    const vote = request.body
    updateVotesByArticleId(article_id, vote)
    .then((updatedArticle) => {
        response.status(200).send({updatedArticle})
    })
    .catch(next)
}

exports.deleteComment = (request, response, next) => {
    const {comment_id} = request.params
    removeComment(comment_id)
    .then((deletedComment) => {
        response.status(204).send({deletedComment})
    })
    .catch(next)
}