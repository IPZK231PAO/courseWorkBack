const jwt = require('jsonwebtoken');
const KEY = process.env.SECRETKEY;

const adminMiddleware = (req, res, next) => {
    console.log('ADMIN MIDDLEWARE ACTIVATED');
    const token = req.cookies['auth-token'];
    console.log('Token:', token);

    if (!token) {
        return res.status(401).send(
            'You need to register or login first. <br> <a href="/login">Login</a> <br> <a href="/register">Registration</a>'
        );
    }

    jwt.verify(token, KEY, (error, decoded) => {
        if (error) {
            console.error('Invalid token:', error);
            return res.redirect('/login');
        }

        console.log('Token verified:', token);
        req.user = decoded;
        console.log('Decoded user:', req.user);

        if (req.user.role !== 'admin') {
            return res.status(403).send('Access denied. Admins only.');
        }

        next();
    });
};

module.exports = adminMiddleware;
