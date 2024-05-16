const jwt = require('jsonwebtoken')
const KEY = process.env.SECRETKEY

exports.generateToken = (id, username, email, role) => {
	console.log(KEY)
	return jwt.sign({ id, username, email, role }, KEY, { expiresIn: '5h' })
}

exports.verifyToken = token => {
	try {
		return jwt.verify(token, KEY)
	} catch (error) {
		console.log(`Verifying failed: ${error}`)
		return null
	}
}
