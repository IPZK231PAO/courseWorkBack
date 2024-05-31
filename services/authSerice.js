const jwt = require('jsonwebtoken')
const KEY = process.env.SECRETKEY

exports.generateToken = (id, username, email, role) => {
	console.log(KEY)
	return jwt.sign({ id, username, email, role }, KEY, { expiresIn: '5h' })
}


