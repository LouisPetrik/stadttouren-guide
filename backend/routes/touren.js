const express = require('express')
const { exec } = require('child_process')

const { getTouren, tourHinzufuegen } = require('../db')
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

// Um OSRM Anfragen weiterzuleiten

// vielleicht für später, um requests an OSRM über Express abzuwickeln

// nur zum Testen und bearbeiten der Routen Seite
router.get('/tour-bearbeiten', (req, res) => {
  res.render('tour', {
    layout: false,
  })
})

// Soll abfangen wenn Nutzer nicht-existierende Tour aufruft
router.get('/tour', (req, res) => {
  res.render('nicht-gefunden', {
    layout: false,
    objekt: 'Tour',
    fallback: {
      text: 'Zurück zur Tourenübersicht',
      link: '/touren',
    },
  })
})

module.exports = router
