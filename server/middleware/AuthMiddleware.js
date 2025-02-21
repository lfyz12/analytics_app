const jwt = require('jsonwebtoken')
const tokenController = require('../controllers/tokenController')
const ApiError = require('../error/ApiError')


module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        //const {accessToken} = req.cookies
        //const token = accessToken
        const token = req.headers.authorization.split(' ')[1] // Bearer asdfdsgksld
        if (!token) {
            return next(ApiError.unauthorized())
        }
        const decoded = tokenController.validateAccessToken(token)
        if (!decoded) {
            return next(ApiError.unauthorized())
        }
        req.user = decoded
        next()
    } catch (e) {
        return next(ApiError.unauthorized())
    }
}