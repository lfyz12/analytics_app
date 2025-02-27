const {Token} = require('../models/models')
const jwt = require('jsonwebtoken')

class TokenController {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {expiresIn: '60m'})
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {expiresIn: '10d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.ACCESS_SECRET_KEY)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.REFRESH_SECRET_KEY)
            return userData
        } catch (e) {
            return null
        }
    }

    async saveToken(employeeId, refreshToken) {
        const tokenData = await Token.findOne({where: {employeeId: employeeId}})
        if (tokenData) {
            return await Token.update({refreshToken: refreshToken}, {where: {employeeId: employeeId}})
        }
        const token = await Token.create({employeeId: employeeId, refreshToken: refreshToken})
        return token
    }

    async removeToken(refreshToken) {
        const deleted = await Token.destroy({where: {refreshToken: refreshToken}})
        return deleted
    }

    async findToken(refreshToken) {
        const token = await Token.findOne({where: {refreshToken: refreshToken}})
        return token
    }
}

module.exports = new TokenController()