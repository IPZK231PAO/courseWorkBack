const bcrypt = require('bcrypt')

exports.encrypt = (data, rounds) => {
	const encryptedData = bcrypt.hashSync(data, rounds)
	return encryptedData
}
