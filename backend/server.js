const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const session = require('express-session')
const { Pool } = require('pg')

const benutzerRoutes = require('./routes/benutzer')

// importieren der Datenbank Funktionen
const {
  benutzerAnlegen,
  getBenutzer,
  benutzerLoeschen,
  benutzerPruefen,
  passwortAendern,
} = require('./db')

const app = express()
const PORT = 3000

// Anlegen der Verbindung
const db = new Pool({
  user: 'meinBenutzer',
  host: 'localhost',
  database: 'meineDatenbank',
  password: 'meinPasswort',
  port: 5432,
})

// Anlegen einer Middleware, um die DB Verbindung an die Requests zu übergeben
// so muss nicht in jeder Route die DB Verbindung neu hergestellt werden
app.use((req, res, next) => {
  req.db = db
  next()
})

// Es muss ein JS objekt mit id, email, password für den user erstellt werden für den user

// Dummy users array
// const users = [{ id: 1, email: 'user@example.com', password: 'password' }]

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },

    async function (email, password, done) {
      const [benutzer] = await benutzerPruefen(db, email, password)

      // Prüfen ob der nutzer in der DB existiert
      //const [benutzer] = await benutzerPruefen(db, email, password)
      // benutzer ist promise
      console.log('Benutzer: ', benutzer)

      if (!benutzer) {
        return done(null, false, { message: 'Falsche E-Mail oder Passwort.' })
      }

      return done(null, benutzer)
    }
  )
)

// Passport serializeUser and deserializeUser
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
  getBenutzer(db, id).then((benutzer) => {
    done(null, benutzer)
  })
})

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.send('<h1>Startseite</h1><a href="/login">Login</a>')
})

// NUR ZUM TESTEN

app.get('/benutzer-erstellen', (req, res) => {
  benutzerAnlegen(db, 'test', 'test', 'test@web.de')
  res.send('Benutzer erstellt')
})

app.get('/benutzer', (req, res) => {
  getBenutzer(db).then((result) => res.json(result))
})

app.get('/passwort-pruefen', (req, res) => {
  benutzerPruefen(db, 'testnutzer', '123456').then((result) => res.json(result))
})

// NUR ZUM TESTEN ENDE

// routen unter routes/benutzer.js
app.use(benutzerRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
