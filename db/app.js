const express = require("express")
const {getApi, getTopics, getArticleById, getArticles, getCommentsByArticleId, postCommentsByArticleId} = require (`${__dirname}/controllers/app.controllers.js`)
const app = express()

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.use(express.json())

app.post("/api/articles/:article_id/comments", postCommentsByArticleId)

app.use("/*", (request, response, next) => {
    response.status(404).send({msg: "Not available"})
})

app.use((error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({msg: 'Bad request'})
    } else next (error)
})

app.use((error, request, response, next) => {
    if (error.status && error.msg){
        response.status(error.status).send({msg:error.msg})
    } else {
        next(error)
    }
})

app.use((error, request, response, next) => {
    console.log(error.code, "<<<< error in 500")
    response.status(500).send({msg: 'Internal server error'})
})

module.exports = app;