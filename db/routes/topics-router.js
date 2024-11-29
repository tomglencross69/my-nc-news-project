const topicsRouter = require("express").Router()
const {getTopics} = require(`${__dirname}/../controllers/app.controllers.js`)

topicsRouter
.route("/")
.get(getTopics)

module.exports = topicsRouter