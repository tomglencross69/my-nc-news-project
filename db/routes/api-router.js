const apiRouter = require("express").Router()
const articlesRouter = require(`${__dirname}/articles-router.js`)
const usersRouter = require(`${__dirname}/users-router.js`)
const commentsRouter = require(`${__dirname}/comments-router.js`)
const topicsRouter = require(`${__dirname}/topics-router.js`)
const {getApi} = require(`${__dirname}/../controllers/app.controllers.js`)

apiRouter.get("/", getApi)

apiRouter.use("/articles", articlesRouter)

apiRouter.use("/comments", commentsRouter)

apiRouter.use("/topics", topicsRouter)

apiRouter.use("/users", usersRouter)

module.exports = apiRouter