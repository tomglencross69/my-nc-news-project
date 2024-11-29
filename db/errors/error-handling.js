exports.postgresErrors = ((error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({msg: 'Bad request'})
    }
    if (error.code === '23502') {
        response.status(400).send({msg: 'Error in structure of request'})
    }
    if (error.code === '23503') {
        response.status(404).send({msg: error.detail})
    } else next (error)
})

exports.customErrors = ((error, request, response, next) => {
    if (error.status && error.msg){
        response.status(error.status).send({msg:error.msg})
    } else {
        next(error)
    }
})

exports.serverError = ((error, request, response, next) => {
    console.log(error, "error in 500")
    response.status(500).send({msg: 'Internal server error'})
})

