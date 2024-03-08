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

const OSRMserver = 'http://osrm:5000/route/v1'

router.get('/osrm-backend/*', (req, res) => {
  // cut out the /osrm-backend part of the URL
  req.url = req.url.replace('/osrm-backend', '')

  console.log('request an OSRM: ', req.url)

  //proxy.web(req, res)

  // Construct the proxied request URL
  //const proxiedUrl = `${OSRMserver}${req.url}`
  const proxiedUrl = `${OSRMserver}${req.url}`
  console.log('proxiedUrl: ', proxiedUrl)

  // run wget locally to get the data from OSRM

  exec(`curl -L ${proxiedUrl}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)
    res.send(stdout)
  })
})

// vielleicht für später, um requests an OSRM über Express abzuwickeln
/*
const proxyUrl = 'http://locahost:5000'

router.get('/osrm-backend/foot/:coords', async (req, res) => {
  // Extract coordinates from the request URL
  const coords = req.params.coords.split(';')
  const origin = coords[0]
  const destination = coords[1]

  // Build the query parameters based on the original request
  const queryParams = new URLSearchParams({
    overview: req.query.overview,
    alternatives: req.query.alternatives,
    steps: req.query.steps,
    hints: req.query.hints,
  })

  // Construct the proxied request URL
  const proxiedUrl = `${proxyUrl}/foot/${origin};${destination}?${queryParams}`

  try {
    // Forward the request to the other server using Axios
    const response = await axios.get(proxiedUrl)

    // Send the response back to the frontend app
    res.send(response.data)
  } catch (error) {
    console.error('Error forwarding request:', error)
    res.status(500).send('Error forwarding request')
  }
})*/

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
