const endpointsJson = require(`${__dirname}/../../endpoints.json`)
const {fetchTopics, fetchArticleById} = require(`${__dirname}/../models/app.models.js`)

exports.getApi = (request, response) => {
    response.status(200).send({endpoints: endpointsJson});
  }

exports.getTopics = (request, response, next) => {
    const {topics} = request.query
    fetchTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
    .catch(next)
}

exports.getArticleById = (request, response, next) => {
    const {article_id} = request.params
    fetchArticleById(article_id)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch(next)
}