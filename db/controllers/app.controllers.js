const endpointsJson = require(`${__dirname}/../../endpoints.json`)

exports.getApi = (request, response) => {
    console.log('hello from getApi in controller')
    response.status(200).send({endpoints: endpointsJson});
  }