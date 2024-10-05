const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleWare = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Token not provided',
            status: 'ERROR'
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'Invalid or expired token',
                status: 'ERROR'
            });
        }

        if (user.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                message: 'Access denied',
                status: 'ERROR'
            });
        }
    });
};

const authUserMiddleWare = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = req.params.id;

    if (!token) {
        return res.status(401).json({
            message: 'Token not provided',
            status: 'ERROR'
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'Invalid or expired token',
                status: 'ERROR'
            });
        }

        console.log('user', user);
        if (user.isAdmin || user.id === userId) {
            next();
        } else {
            return res.status(403).json({
                message: 'Access denied',
                status: 'ERROR'
            });
        }
    });
};

module.exports = {
    authMiddleWare,
    authUserMiddleWare
};
