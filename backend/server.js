const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const session = require('express-session')

const benutzerRoutes = require('./routes/benutzer')

const app = express()
const PORT = 3000

// Dummy users array
const users = [{ id: 1, email: 'user@example.com', password: 'password' }]

// Passport Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function (email, password, done) {
      // muss noch eresetzt werden mit DB und Hashing dafür
      const user = users.find(
        (user) => user.email === email && user.password === password
      )
      if (!user) {
        // muss wohl noch im Frontend angezeigt werden mit Flash (oder redirect?)
        return done(null, false, { message: 'Falsche E-Mail oder Passwort.' })
      }

      // Wenn alles passt, dann wird der User eingeloggt
      return done(null, user)
    }
  )
)

// Passport serializeUser and deserializeUser
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  const user = users.find((user) => user.id === id)
  done(null, user)
})

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.send('<h1>Startseite</h1><a href="/login">Login</a>')
})

app.use(benutzerRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
