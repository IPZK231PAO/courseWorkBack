const mongoose = require('mongoose')

module.exports = async () => {
	try {
		await mongoose
			.connect(process.env.DB)
			.then(() => {
				console.log('Connected to MongoDB')
			})
			.catch(err => {
				console.error('Failed to connect to MongoDB', err)
			})
	} catch (error) {
		console.log(error)
	}
}
