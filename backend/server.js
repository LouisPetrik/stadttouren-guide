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

app.get('/', (req, res) => {
  res.render('index')
})

// NUR ZUM TESTEN
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
