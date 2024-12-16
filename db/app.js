const express = require("express")
const app = express()
const {postgresErrors, customErrors, serverError} = require(`${__dirname}/errors/error-handling.js`)
const apiRouter = require(`${__dirname}/routes/api-router.js`)
const cors = require('cors')

app.use(cors())

app.use(express.json())

app.use("/api", apiRouter)

app.use("/*", (request, response, next) => {
    response.status(404).send({msg: "Not available"})
})

app.use(postgresErrors)

app.use(customErrors)

app.use(serverError)

module.exports = app;