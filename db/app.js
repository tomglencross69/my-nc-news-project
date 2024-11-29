const express = require("express")
const {getApi, getTopics, getArticleById, getArticles, getCommentsByArticleId, postCommentsByArticleId, patchVotesByArticleId, deleteComment, getUsers} = require (`${__dirname}/controllers/app.controllers.js`)
const app = express()
const {postgresErrors, customErrors, serverError} = require(`${__dirname}/errors/error-handling.js`)
const apiRouter = require(`${__dirname}/routes/api-router.js`)

app.use(express.json())

app.use("/api", apiRouter)

app.use("/*", (request, response, next) => {
    response.status(404).send({msg: "Not available"})
})

app.use(postgresErrors)

app.use(customErrors)

app.use(serverError)

module.exports = app;