const express = require('express')

const { getTouren, tourHinzufuegen } = require('../db')
const router = express.Router()

// Test: Komplette liste vno Touren
router.get('/touren', async (req, res) => {
  const tourenListe = await getTouren(req.db)
  console.log('Tourenliste: ', tourenListe)

  // jeweils den Usernamen an die Tour anhängen
  /* 
  tourenListe.forEach(async (tour) => {
    const benutzer = await getBenutzerById(req.db, tour.benutzer_id)
    console.log('Benutzer: ', benutzer)
    tour.benutzername = benutzer.benutzername
  })*/

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
  const id = req.params.id
  console.log('ID ist: ', id)
  res.render('tour', {
    layout: false,
  })
})

module.exports = router
