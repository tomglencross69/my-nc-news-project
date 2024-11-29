const commentsRouter = require("express").Router()
const {deleteComment} = require(`${__dirname}/../controllers/app.controllers.js`)

commentsRouter
.route("/:comment_id")
.delete(deleteComment)

module.exports = commentsRouter