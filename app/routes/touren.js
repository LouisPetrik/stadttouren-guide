const express = require('express')
const { exec } = require('child_process')

const {
  getTouren,
  tourHinzufuegen,
  getBenutzer,
  getTourById,
  getTourenVonBenutzer,
  updateTour,
  tourLoeschen,
  updateTourMetadaten,
} = require('../db')
const router = express.Router()

// Test: Komplette liste vno Touren
router.get('/touren', async (req, res) => {
  const tourenListe = await getTouren(req.db)

  res.render('touren', { touren: tourenListe })
})

// DIese Funktion soll sowohl zum erstellen als auch zum bearbeiten von Touren genutzt werden. Änderungen werden hierhin geschickt
// DEPRECATED
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

/* POST Handler zum Bearbeiten einer Tour, zugehörig zu /tour-bearbeiten (siehe unten)
 */
router.post('/tour-bearbeiten/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const tourId = parseInt(req.params.id)

    console.log('Nutzer moechte Tour bearbeiten: ', tourId)

    // Body müssen [{lat: 1, lng: 2}, {lat: 3, lng: 4}, ...] sein
    console.log('TOUR Bearbeiten: Inhalt des Body: ', req.body)

    // Ab hier muss validiert werden, ob der Nutzer auch wirklich die Berechtigung hat, die Tour zu bearbeiten.
    // Auch wenn dies bereits für den GET-Request gemacht wurde, muss es hier nochmal gemacht werden, da der Nutzer auch die URL manipulieren könnte.
    // z. B. wenn er manuell /tour-bearbeiten/1 aufruft, obwohl er die Tour nicht erstellt hat.

    // Checken, ob Nutzer auch wirklich die Berechtigung hat, die Tour zu bearbeiten. Indem wir die Tour laden und schauen, ob der Nutzer der Ersteller ist.
    const benutzername = req.user[0].benutzername

    console.log('Benutzername ist: ', benutzername)
    // Gucken, ob Tour mit ID eine Tour des Nutzers ist
    const tourenVonBenutzer = await getTourenVonBenutzer(req.db, benutzername)

    // überprüfen, ob die zu bearbeitende Tour auch wirklich in der Liste der Touren des Nutzers ist
    const tour = tourenVonBenutzer.find((tour) => tour.id === tourId)

    if (tour) {
      console.log('POST: Benutzer hat Rechte zum Bearbeiten')

      // Hier wird die Tour bearbeitet

      // Destrukturierung des Body
      const { punkte, distanz, dauer } = req.body

      // zunächst die Punkte zu JSON String umwandeln
      await updateTour(req.db, tourId, JSON.stringify(punkte), distanz, dauer)

      res.send('Erfolgreich, Rechte zum Bearbeiten vorhanden')
      return
    }
  } else {
    console.log('POST: Nutzer hat keine Berechtigung zum Bearbeiten')
    res.send('Keine Berechtigung zum Bearbeiten einer Tour via POST-Request')
  }
})

router.get('/tour/:id', async (req, res) => {
  /* hier koennen dann die notwendigen informationen fuer die tour geholt werden */
  const id = req.params.id

  // Wichtige Daten der Tour laden
  const tour = await getTourById(req.db, id)

  const { punkte } = tour[0]

  console.log('ID ist: ', id)
  res.render('tour', {
    layout: false,
    punkte: JSON.stringify(punkte),
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

/* 
router.get('/neue-tour', (req, res) => {
  // Nutzer muss eingeloggt sein, um eine Tour zu erstellen, damit Nutzer in DB zugewiesen werden kann.
  if (req.isAuthenticated()) {
    res.render('neue-tour', {
      layout: false,
    })
  } else {
    res.redirect('/login')
  } 
})*/

// Für das Neu-Anlegen einer Tour
router.get('/tour-bearbeiten/neu', (req, res) => {
  // Nutzer muss eingeloggt sein, um eine Tour zu erstellen, damit Nutzer in DB zugewiesen werden kann.
  if (req.isAuthenticated()) {
    res.render('neue-tour', {
      layout: false,
    })
  } else {
    res.redirect('/login')
  }
})

// Empfängt das Initiale Speichern einer Tour unter /tour-bearbeiten/neu
// Insoferne erfolgreich, leitet auf /tour-bearbeiten/:id weiter.
router.post('/neue-tour', async (req, res) => {
  if (req.isAuthenticated()) {
    const { punkte, distanz, dauer } = req.body
    const benutzer_id = req.user[0].id

    console.log('Tour erstellt von', benutzer_id)
    console.log('NEU Punkte der Tour: ', punkte)

    // Query gibt kompletten DB eintrag der Tour zurück, sodass die ID der Tour genutzt werden kann für redirect
    const tour = await tourHinzufuegen(
      req.db,
      'Neue Tour',
      'Beschreibung folgt',
      JSON.stringify(punkte), // müssen die weiter formatiert werden?
      distanz,
      dauer,
      benutzer_id
    )

    res.json({ id: tour.id })
  }
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

    console.log('GET: Nutzer hat Berechtigung zum Bearbeiten der Tour')

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

router.get('/gespeicherte-touren', async (req, res) => {
  //const benutzername = req.user[0].benutzername
  //const gespeicherteTouren = await getGespeicherteTouren(req.db, benutzername)
  //res.render('gespeicherte-touren', { gespeicherteTouren })
  res.render('gespeicherte-touren')
})

// Wenn aus /profil per fetch-POST eine Tour gelöscht werden soll
router.post('/tour-loeschen', async (req, res) => {
  if (req.isAuthenticated()) {
    const tourId = parseInt(req.body.tourId)
    const benutzername = req.user[0].benutzername

    console.log('Nutzer moechte Tour loeschen: ', tourId)

    // hier noch testen, ob Nutzer auch wirklich die Berechtigung hat, die Tour zu löschen

    // Hier wird die Tour gelöscht

    const rowCount = await tourLoeschen(req.db, tourId, benutzername)

    if (rowCount > 0) {
      res
        .status(200)
        .json({ success: true, message: 'Tour erfolgreich geloescht' })
    } else {
      res
        .status(404)
        .json({ success: false, message: 'Tour konnte nicht geloescht werden' })
    }
  } else {
    res.redirect('/login')
  }
})

// Umbenennen und Ändern der Beschreibung von Touren
router.post('/tour-metadaten', async (req, res) => {
  if (req.isAuthenticated()) {
    const { tourId, art, text } = req.body

    // Abfangen von unerlaubten Metadaten, da mit der art der Metadaten auch die Spalte in der DB bestimmt wird
    if (art !== 'name' && art !== 'beschreibung') {
      res
        .status(400)
        .json({ success: false, message: 'Ungültige Art der Metadaten' })
      return
    }

    const benutzername = req.user[0].benutzername

    console.log('Nutzer moechte Tour umbenennen: ', tourId)

    // hier noch testen, ob Nutzer auch wirklich die Berechtigung hat, die Tour zu bearbeiten

    // Hier werden die Metadaten der Tour geändert

    const rowCount = await updateTourMetadaten(req.db, tourId, art, text)

    if (rowCount > 0) {
      res
        .status(200)
        .json({
          success: true,
          message: 'Name / Beschreibung erfolgreich geändert',
        })
    } else {
      res
        .status(404)
        .json({
          success: false,
          message: 'Name / Beschreibung konnte nicht geändert werden',
        })
    }
  } else {
    res.redirect('/login')
  }
})

// Nur zum Testen
router.get('/get-touren', async (req, res) => {
  const routes = await getTouren(req.db)
  res.json(routes)
})

module.exports = router
