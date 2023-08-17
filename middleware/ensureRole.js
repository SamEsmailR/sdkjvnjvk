// middlewares.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function checkRole(role) {
    return function(req, res, next) {
        const token = req.header('Authorization');
        if (!token) return res.status(401).send('Access Denied: No Token Provided!');

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            if (req.user.role !== role) return res.status(403).send('Access Denied: Incorrect Role!');
            next();
        } catch (exception) {
            res.status(400).send('Invalid token');
        }
    };
}

module.exports = {
    checkRole
};
