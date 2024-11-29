const articlesRouter = require("express").Router()
const {getArticleById, getArticles, getCommentsByArticleId, postCommentsByArticleId, patchVotesByArticleId} = require(`${__dirname}/../controllers/app.controllers.js`)

articlesRouter
.route("/")
.get(getArticles)

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchVotesByArticleId)

articlesRouter
.route("/:article_id/comments")
.post(postCommentsByArticleId)
.get(getCommentsByArticleId)



module.exports = articlesRouter