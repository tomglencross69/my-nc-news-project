const usersRouter = require("express").Router()
const {getUsers} = require(`${__dirname}/../controllers/app.controllers.js`)

usersRouter
.route("/")
.get(getUsers)

module.exports = usersRouter