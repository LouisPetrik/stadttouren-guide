const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router()
const {
  benutzerAnlegen,
  getBenutzer,
  benutzerLoeschen,
  passwortPruefen,
  passwortAendern,
} = require('../db')

const saltRounds = 10

router.get('/registrieren', (req, res) => {
  res.send(
    '<form action="/registrieren" method="post"><div><label>Benutzername:</label><input type="text" name="benutzername"/><br/></div><div><label>Email:</label><input type="text" name="email"/><br/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Register"/></div></form>'
  )
})

router.post('/registrieren', async (req, res) => {
  const { benutzername, email, password } = req.body
  const hash = await bcrypt.hash(password, saltRounds)
  benutzerAnlegen(req.db, benutzername, hash, email)
  res.redirect('/login')
})

router.get('/login', (req, res) => {
  res.send(
    '<form action="/login" method="post"><div><label>Email:</label><input type="text" name="email"/><br/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Log In"/></div></form>'
  )
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
    res.send('<h1>Dein Profil</h1><a href="/logout">Logout</a>')
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

module.exports = router
