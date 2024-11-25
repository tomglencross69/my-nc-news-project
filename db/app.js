const express = require("express")
const {getApi} = require (`${__dirname}/controllers/app.controllers.js`)
const app = express()

app.get("/api", getApi)

module.exports = app;