const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router()
const {
  benutzerAnlegen,
  getBenutzer,
  benutzerLoeschen,
  benutzerPruefen,
  passwortAendern,
  benutzerExistiert,
  getTourenVonBenutzer,
} = require('../db')

const saltRounds = 10

router.get('/registrieren', (req, res) => {
  res.render('registrieren')
})

router.post('/registrieren', async (req, res) => {
  const { benutzername, email, password } = req.body
  const hash = await bcrypt.hash(password, saltRounds)
  // vorher überprüfen, ob der Benutzername oder die E-Mail schon existiert
  const benutzer = await benutzerExistiert(req.db, benutzername, email)
  if (benutzer.length > 0) {
    // muss in zukunft noch verbessert werden
    res.send('Benutzername oder E-Mail existiert bereits')
    return
  } else {
    benutzerAnlegen(req.db, benutzername, hash, email)
    res.redirect('/login')
  }
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/profil',
    failureRedirect: '/login',
  })
)

router.get('/profil', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('profil', { benutzername: req.user[0].benutzername })
  } else {
    res.redirect('/login')
  }
})

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    req.session.destroy(function (err) {
      if (err) {
        console.log('Error: Session loeschen fehlgeschlagen', err)
      }
      req.user = null
      res.redirect('/')
    })
  })
})

// Eine Route für alle /benutzer/<benutzername> Anfragen
router.get('/benutzer/:benutzername', async (req, res) => {
  const benutzername = req.params.benutzername

  //const benutzer = await getBenutzer(req.db, benutzername)
  const touren = await getTourenVonBenutzer(req.db, benutzername)
  res.render('benutzer', { benutzername: benutzername, touren: touren })
})

// Genutzt in: profil.handlebars
router.post('/account-loeschen', async (req, res) => {
  // Benutzername aus der Session holen
  const benutzername = req.user[0].benutzername
  const email = req.user[0].email

  console.log(benutzername, 'wird gelöscht')
  console.log('Email: ', email)

  // überprüfen, ob passwort korrekt ist
  const passwort = req.body.passwort
  console.log('Passwort: ', passwort)
  // hier muss statt des Benutzernamens die E-Mail übergeben werden - email, passwort
  const [benutzer] = await benutzerPruefen(req.db, email, passwort)
  console.log('Benutzer: ', benutzer)

  if (!benutzer) {
    res.send('Passwort ist falsch')
    return
  } else {
    await benutzerLoeschen(req.db, benutzername)
    res.send('Auf Wiedersehen!')
  }

  //await benutzerLoeschen(req.db, benutzername)
  //res.redirect('/login')
})

module.exports = router
