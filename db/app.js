const express = require("express")
const {getApi, getTopics} = require (`${__dirname}/controllers/app.controllers.js`)
const app = express()

app.get("/api", getApi)

app.get("/api/topics", getTopics)


//this must be below all requests
app.use("/*", (request, response, next) => {
    response.status(404).send({msg: "Not available"})
})

app.use((error, request, response, next) => {
    response.status(500).send({msg: 'Internal server error'})
})

module.exports = app;