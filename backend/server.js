const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const session = require('express-session')
const { Pool } = require('pg')
const { engine } = require('express-handlebars')
const flash = require('connect-flash')

// importieren der Routen
const benutzerRoutes = require('./routes/benutzer')
const tourenRoutes = require('./routes/touren')

// importieren der Datenbank Funktionen
const {
  benutzerAnlegen,
  getBenutzer,
  getBenutzerById,
  benutzerLoeschen,
  benutzerPruefen,
  passwortAendern,
} = require('./db')

console.log('server')

const app = express()
const PORT = 3000

// Anlegen der Verbindung
const db = new Pool({
  user: 'meinBenutzer',
  host: 'db', // ist der Name des Services in docker-compose.yml
  database: 'meineDatenbank',
  password: 'meinPasswort',
  port: 5432,
})

/**
 * Anlegen einer Middleware, um die DB Verbindung an die Requests zu übergeben.
 * So muss nicht in jeder Route die DB Verbindung neu hergestellt werden.
 */
app.use((req, res, next) => {
  req.db = db
  next()
})

/** Midldeware für die Session */
app.use(
  session({
    secret: 'geheimnis', // Setze ein starkes Geheimnis für die Session
    resave: false,
    saveUninitialized: true,
  })
)

app.use(flash())

// Handlebars als templating engine registieren
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

// Es muss ein JS objekt mit id, email, password für den user erstellt werden für den user

// Dummy users array
// const users = [{ id: 1, email: 'user@example.com', password: 'password' }]
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const benutzer = await benutzerPruefen(db, email, password)
        return done(null, benutzer)
      } catch (error) {
        //req.flash('info', 'Falsches Passwort oder Benutzername')
        // Nutzt die Fehlermeldung für die Rückmeldung an den Nutzer
        return done(null, false, { message: 'Falsches Passwort oder E-Mail' })
        // send flash message
      }
    }
  )
)

// Passport serializeUser and deserializeUser
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

// Müsste hier noch done die user.id übergeben werden?
passport.deserializeUser(async function (id, done) {
  const benutzer = await getBenutzerById(db, id)
  done(null, benutzer)
})

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

// Static files on route /public
app.use('/public', express.static('public'))

/**
 * @param {object} req - Request
 * @param {object} res - Response
 */
app.get('/', (req, res) => {
  res.render('index')
})

/** Nur zum Testen */
app.get('/benutzer', async (req, res) => {
  const benutzerListe = await getBenutzer(db)
  res.json(benutzerListe)
})

// routen unter routes/benutzer.js
app.use(benutzerRoutes)
// Tour routen - also
app.use(tourenRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
