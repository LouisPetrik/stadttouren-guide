const express = require('express')

const passport = require('passport')
const router = express.Router()

router.get('/login', (req, res) => {
  res.send(
    '<form action="/login" method="post"><div><label>Email:</label><input type="text" name="email"/><br/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Log In"/></div></form>'
  )
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })
)

router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('<h1>Dein Profil</h1><a href="/logout">Logout</a>')
  } else {
    res.redirect('/login')
  }
})

router.get('/test', (req, res) => {
  res.send('test seite')
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
