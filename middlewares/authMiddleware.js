const jwt = require('jsonwebtoken')
const KEY = process.env.SECRETKEY

const authMiddleware = (req, res, next) => {
	console.log('AUTH MIDDLEWARE ACTIVATED')
	const token = req.cookies['auth-token']
	console.log(token)

	if (!token) {
		return res
			.status(401)
			.send(
				'You should to registration or login <br> <a href="/login">Login</a>  <br> <a href="/register">Registration</a>'
			)
	} else {
		jwt.verify(token, KEY, (error, decoded) => {
			if (error) {
				console.error('Invalid token:', error)
				return res.redirect('/login')
			}
			console.log(token)

			console.log('Token verified:', token)
			req.user = decoded
			console.log('Decoded user:', req.user)

			next()
		})
	}
}
module.exports = authMiddleware
