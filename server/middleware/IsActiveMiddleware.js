const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError')
const tokenController = require('../controllers/tokenController')

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
        if (!decoded || !decoded.is_active) {
            return next(ApiError.forbidden())
        }
        req.user = decoded
        next()
    } catch (e) {
        return next(ApiError.forbidden())
    }
}