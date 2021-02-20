const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = {
    authenticateToken: function(req, res, next) {
        const token = req.cookies.token

        // check if token has been sent   
        if (token == null) {
            return res.sendStatus(401)
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })
    }
};