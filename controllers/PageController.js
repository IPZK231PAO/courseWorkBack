const filesController = require('./FilesController')
const songController = require('./SongController')
const userController = require('./UserController')
const fs = require('fs')
const path = require('path')
const generateLinks = (authenticated, role) => {
	let links = [
		{ url: '/', title: 'Home' },
		{ url: '/library', title: 'Library' },
		{ url: '/upload', title: 'Upload' },
		{ url: '/register', title: 'Registration' },
		{ url: '/login', title: 'Login' },
		{ url: '/profile', title: 'Profile' },
		{ url: '/history', title: 'History' },
		{ url: '/logout', title: 'Logout' }
	]

	if (authenticated) {
		if (role === 'admin') {
			links.push({ url: '/admin', title: 'Admin Dashboard' })
		} else {
			const hiddenLinks = ['/admin']
			links = links.filter(link => !hiddenLinks.includes(link.url))
		}

		const hiddenLinks = ['/login', '/register']
		links = links.filter(link => !hiddenLinks.includes(link.url))
	} else {
		const hiddenLinks = [
			'/',
			'/library',
			'/upload',
			'/logout',
			'/profile',
			'/history'
		]
		links = links.filter(link => !hiddenLinks.includes(link.url))
	}

	return links
}

exports.history = async (req, res) => {
	const role = req.user.role
	const username = req.user.username
	console.log(username)
	const links = generateLinks(true, role)
	const { history } = await userController.getListened(username)

	res.render('main', {
		links,
		history,
		title: `Історія прослуховувань користувача ${username}`,
		content: 'history'
	})
}
exports.profile = async (req, res) => {
	const role = req.user.role
	const username = req.user.username
	const userEmail = req.user.email
	const links = generateLinks(true, role, userEmail)
	const stylePath = '../styles/profile.css'
	console.log(role)
	const user = await userController.getUserByEmail(userEmail)
	console.log(`PAGE PROFILE USER: ${user}`)

	res.render('main', {
		links,
		username,
		user,
		stylePath,
		title: 'Profile Page',
		content: 'profile'
	})
}

exports.homePage = async (req, res) => {
	const role = req.user.role
	const songs = await songController.getAllSongs()

	const randomSongs = []

	while (randomSongs.length < 3) {
		const randomIndex = Math.floor(Math.random() * songs.length)
		const song = songs[randomIndex]

		if (!randomSongs.includes(song)) {
			randomSongs.push(song)
		}
	}
	console.log(randomSongs)
	const username = req.user.username
	const links = generateLinks(true, role)
	res.render('main', {
		links,
		songs: randomSongs,
		username,
		title: 'Home Page',
		content: 'home'
	})
}
exports.library = async (req, res) => {
	const role = req.user.role
	const username = req.user.username
	const links = generateLinks(true, role)

	try {
		const songs = await songController.getAllSongs()

		res.render('main', {
			links,
			songs,
			username,
			title: 'Library',
			content: 'library'
		})
	} catch (error) {
		throw new error()
	}
}

exports.uploadPage = async (req, res) => {
	const role = req.user.role
	const username = req.user.username
	const links = generateLinks(true, role)
	try {
		const uploads = await filesController.uploadsProcessing()
		console.log(uploads)

		res.render('main', {
			links,
			username,
			uploads,
			title: 'Upload Page',
			content: 'upload'
		})
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
exports.register = async (req, res) => {
	const links = generateLinks(false, null)
	try {
		res.render('main', {
			links,
			title: 'Auth Page',
			content: 'register'
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

exports.login = async (req, res) => {
	const links = generateLinks(false, null)
	try {
		res.render('main', {
			links,
			title: 'Auth Page',
			content: 'login'
		})
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
