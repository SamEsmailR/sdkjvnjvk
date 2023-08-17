const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (allowedRoles) => {
    return (req, res, next) => {
        const token = req.header('x-auth-token'); // Assuming you are sending token in the header

        // Check if token exists
        if (!token) {
            return res.status(401).send('No token, authorization denied.');
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.JWT_SECRET);

            // Check if user's role is among the allowed roles for this route
            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).send('Access denied for this role.');
            }

            // Add user from the token to the request object
            req.user = decoded;

            next();
        } catch (error) {
            console.error('Role check error:', error.message);
            res.status(401).send('Token is not valid.');
        }
    };
};
