const authService = require('../services/authSerice')
const User = require('../models/user')
const cryptoService = require('../services/cryptoService')
const bcrypt = require('bcrypt')
exports.registration = async (req, res) => {
	try {
		console.log('PROCESS REGISTRATION USERDATA')
		console.log(req.body)

		const { username, email, password } = req.body

		const hashedPassword = await cryptoService.encrypt(password, 10)

		let role = 'user'

		if (password === 'admin123' && username === 'admin') {
			role = 'admin'
		}

		const existingUser = await this.checkExistingUser({ email })

		if (existingUser) {
			return res.redirect('/login')
		}

		const user = await createUser({
			username,
			email,
			password: hashedPassword,
			role
		})

		console.log(user)
		await saveUser(user)
		const userIDFromDB = User.findOne({ email: user.email }).id
		const token = authService.generateToken(
			userIDFromDB,
			user.username,
			user.email,
			role
		)
		res.cookie('auth-token', token, { httpOnly: true })
		res.redirect('/')
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: 'Registration Failed' })
	}
}

exports.login = async (req, res) => {
	console.log('LOGIN ACRIVATED ' + req.body)
	try {
		const { email, password } = req.body

		const user = await User.findOne({ email: email })
		console.log(user)
		if (!user) {
			res.status(401).send('Password or email does not correct!')
		} else {
			console.log('else')
			isDecryptedPassword = await bcrypt.compare(password, user.password)

			if (!isDecryptedPassword) {
				res.status(401).send('Password or email does not correct!')
			}

			const token = authService.generateToken(
				user._id,
				user.username,
				user.email,
				user.role
			)

			console.log('SUCCESS LOGIN, REDIRECT TO HOME PAGE')
			res.cookie('auth-token', token, { httpOnly: true })
			res.redirect('/')
		}
	} catch (error) {
		console.log('LOGIN FAILED')
		res.status(500).send('Internal server error')
	}
}

exports.logout = (req, res) => {
	console.log(`LOGOUT USER`)
	res.clearCookie('auth-token')
	res.redirect('/login')
}

const createUser = async ({ username, email, password, role }) => {
	const user = new User({
		username: username,
		email: email,
		password: password,
		role: role
	})
	return user
}
const saveUser = async user => {
	try {
		await user.save()
		console.log('SUCCESSFULLY SAVED')
	} catch (error) {
		throw new Error(`Error saving user: ${error.message}`)
	}
}
exports.getUserByEmail = async email => {
	try {
		const user = await User.findOne({ email: email })
		return user
	} catch (error) {
		console.error(`Error getting user by email: ${error}`)
		throw error
	}
}
exports.checkExistingUser = async ({ email }) => {
	try {
		console.log(email)
		const existingUser = await this.getUserByEmail(email.email)
		if (existingUser) {
			console.log(`USER EXIST: `, existingUser)
		}

		return existingUser
	} catch (error) {
		console.error(`Error checking existing user: ${error}`)
		throw error
	}
}
// ! LISTENING HISTORY
// ? IN PROGRESS
exports.addListened = async (req, res) => {
	try {
		const { username, songName } = req.body
		console.log(req.body)
		const user = await User.findOne({ username: username })
		const history = user.listened

		console.log(`LISTENED HISTORY: ${history}`)
		if (history.length >= 15) {
			await User.findOneAndUpdate(
				{ username: username },
				{ $pop: { listened: -1 } }
			)
		}
		await User.findOneAndUpdate(
			{ username: username },
			{ $addToSet: { listened: songName } }
		)

		console.log('USER FINDED AND UPDATED HISTORY')
		res.status(201).json({ success: true, message: 'Added to history' })
	} catch (error) {
		res.status(500).json({ success: false, message: 'Add to listened failed' })
	}
}
exports.getListened = async username => {
	try {
		console.log('GET LISTENED ')
		console.log(username)

		const user = await User.findOne({ username: username })

		console.log(`GET LISTENED USER: ${user.username}`)
		if (!user) {
			return res.status(404).json({ success: false, message: 'Cant get user' })
		}
		return { success: true, history: user.listened }
	} catch (error) {
		console.error('Error fetching listened: ' + error)
		return { success: false, message: 'Getting listening history failed' }
	}
}
