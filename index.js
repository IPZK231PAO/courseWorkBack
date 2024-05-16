require('dotenv').config()
const express = require('express')
const connection = require('./db')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()

// *Services

const updateSongs = require('./services/authSerice')

// *Routes
const homeRoute = require('./routes/index')
const profileRoute = require('./routes/profile')
const uploadRoutes = require('./routes/upload')
const songsRoutes = require('./routes/songs')
const authRoutes = require('./routes/auth')
const listenHistoryRoutes = require('./routes/listenHistory')

// *Parser
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'public', 'views'))

app.unsubscribe(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/music', express.static(path.join(__dirname, 'public', 'music')))

app.use(express.static('public'))

app.use(homeRoute)
app.use(uploadRoutes)
app.use(songsRoutes)
app.use(authRoutes)
app.use(profileRoute)
app.use(listenHistoryRoutes)
const start = () => {
	try {
		app.listen(PORT, error => {
			console.log(`listening port ${PORT}`)
			updateSongs
		})
	} catch (e) {
		console.log(e)
	}
}
start()
connection()
// andreypetrishin21 admin
// IRBevBdKaw83m1Ly
