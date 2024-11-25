const endpointsJson = require(`${__dirname}/../../endpoints.json`)
const {fetchTopics} = require(`${__dirname}/../models/app.models.js`)

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