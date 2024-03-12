const express = require('express')
const { exec } = require('child_process')

const {
  getTouren,
  tourHinzufuegen,
  getBenutzer,
  getTourenVonBenutzer,
} = require('../db')
const router = express.Router()

// Test: Komplette liste vno Touren
router.get('/touren', async (req, res) => {
  const tourenListe = await getTouren(req.db)
  console.log('Tourenliste: ', tourenListe)

  res.render('touren', { touren: tourenListe })
})

// DIese Funktion soll sowohl zum erstellen als auch zum bearbeiten von Touren genutzt werden. Änderungen werden hierhin geschickt
router.post('/tour-erstellen', async (req, res) => {
  const { name, beschreibung } = req.body

  // ID des Users:
  const benutzer_id = req.user[0].id

  // Wie kann ich die ID des Users herausfinden?

  console.log('Tour erstellt von', benutzer_id)
  await tourHinzufuegen(req.db, name, beschreibung, benutzer_id)

  res.redirect('/touren')
})

// Request aus Form wird hierhin geschickt
// Muss noch weiter impllementiert werden
router.post('/tour-merken/:id', async (req, res) => {
  const tourId = parseInt(req.params.id)
  const benutzername = req.user[0].benutzername

  console.log('Nutzer moechte Tour merken: ', tourId)

  // Hier wird die Tour gemerkt
  // await merkeTour(req.db, tourId, benutzername)

  res.redirect('/touren')
})

// POST Handler zum Bearbeiten einer Tour, zugehörig zu /tour-bearbeiten (siehe unten)
router.post('/tour-bearbeiten/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const tourId = parseInt(req.params.id)

    console.log('Nutzer moechte Tour bearbeiten: ', tourId)

    // inhalt des body
    console.log('Inhalt des Body: ', req.body.punkte)
  } else {
    res.send('Keine Berechtigung zum Bearbeiten einer Tour via POST-Request')
  }
})

router.get('/tour/:id', async (req, res) => {
  /* hier koennen dann die notwendigen informationen fuer die tour geholt werden */
  const id = req.params.id

  // Wichtige Daten der Tour laden
  // const tour = await getTour(req.db, id)

  console.log('ID ist: ', id)
  res.render('tour', {
    layout: false,
  })
})

// Soll abfangen wenn Nutzer nicht-existierende Tour aufruft
router.get('/tour', (req, res) => {
  res.render('nicht-gefunden', {
    layout: false,
    objekt: 'Keine Tour gefunden',
    fallback: {
      text: 'Zurück zur Tourenübersicht',
      link: '/touren',
    },
  })
})

// Nutzer landet auf dieser Seite, wenn er eine Tour von sich bearbeiten möchte
router.get('/tour-bearbeiten/:id', async (req, res) => {
  const tourId = parseInt(req.params.id)
  // zu integer parsen, da es aus der URL als String kommt

  console.log('ID von zu bearbeitender Tour: ', tourId)

  // Bearbeiten nur erlauben, wenn Nutzer eingeloggt ist
  if (req.isAuthenticated()) {
    const benutzername = req.user[0].benutzername
    console.log('Benutzername ist: ', benutzername)

    const tourenVonBenutzer = await getTourenVonBenutzer(req.db, benutzername)
    console.log('Touren von Benutzer: ', tourenVonBenutzer)

    // überprüfen, ob die zu bearbeitende Tour auch wirklich in der Liste der Touren des Nutzers ist
    const tour = tourenVonBenutzer.find((tour) => tour.id === tourId)
    console.log('Gefundene Tour: ', tour)

    if (!tour) {
      res.render('nicht-gefunden', {
        layout: false,
        objekt: 'Fehlende Berechtigung oder keine Tour gefunden',
        fallback: {
          text: 'Zurück zum Profil',
          link: '/profil',
        },
      })
      return
    }

    console.log('Nutzer hat Berechtigung zum Bearbeiten der Tour')

    res.render('tour-bearbeiten', {
      layout: false,
      punkte: JSON.stringify(tour.punkte),
    })
  } else {
    // Wenn nicht authentifiziert, redirect auf login, wenn Nutzer nicht authentifiziert ist
    res.redirect('/login')
  }
})

// Fängt ab, wenn Nutzer keine ID angibt, also nur "/tour-bearbeiten" aufruft.
router.get('/tour-bearbeiten', (req, res) => {
  res.render('nicht-gefunden', {
    layout: false,
    objekt: 'Keine Tour zum Bearbeiten gefunden',
    fallback: {
      text: 'Zurück zur Tourenübersicht',
      link: '/touren',
    },
  })
})

module.exports = router
