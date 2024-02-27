const express = require('express')

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

  // Als URL-Path den Namen der Tour verwenden, aber alles klein und Leerzeichen durch Bindestriche ersetzt
  const urlpath = name.toLowerCase().replace(/ /g, '-')

  // ID des Users:
  const benutzer_id = req.user[0].id

  // Wie kann ich die ID des Users herausfinden?

  console.log('Tour erstellt von', benutzer_id)
  await tourHinzufuegen(req.db, name, urlpath, beschreibung, benutzer_id)

  res.redirect('/touren')
})

router.get('/tour/:id', async (req, res) => {
  /* hier koennen dann die notwendigen informationen fuer die tour geholt werden */
  const id = req.params.id

  console.log('ID ist: ', id)
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
