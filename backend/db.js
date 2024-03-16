// const { db } = require('pg')
const bcrypt = require('bcrypt')

/**
 * Benutzer anlegen
 * @param {*} db Datenbankverbindung
 * @param {*} benutzername Selbstgewählter Benutzername
 * @param {*} passwort Selbstgewähltes Passwort
 * @param {*} email Hinterlegte Email-Adresse
 * @returns {Promise} - Gibt den angelegten Benutzer zurück
 */
const benutzerAnlegen = async (db, benutzername, passwort, email) => {
  const res = await db.query(
    'INSERT INTO benutzer (benutzername, passwort, email) VALUES ($1, $2, $3) RETURNING *',
    [benutzername, passwort, email]
  )
  return res.rows[0]
}

/**
 * TEST: Gibt alle Benutzer aus
 * @param {*} db
 * @returns {Promise} - Gibt alle Benutzer zurück
 */
const getBenutzer = async (db) => {
  const res = await db.query('SELECT * FROM benutzer')
  return res.rows
}

/**
 * Benutzer basierend auf ID holen, genutzt beim Authentifizieren u. a.
 * @param {*} db
 * @param {*} id
 * @returns {Promise} - Gibt den gefundenen Benutzer zurück
 */
const getBenutzerById = async (db, id) => {
  const res = await db.query('SELECT * FROM benutzer WHERE id = $1', [id])
  return res.rows
}

/**
 * Falls Benutzer Account schließen moechte
 * @param {*} db Datenbankverbindung
 * @param {*} benutzername Selbstgewählter Benutzername
 * @returns {Promise} - ausstehend
 */
const benutzerLoeschen = async (db, benutzername) => {
  const res = await db.query('DELETE FROM benutzer WHERE benutzername = $1', [
    benutzername,
  ])
  return res.rows
}

// Passwort prüfung bei der Anmeldung. Hasht das Passwort und vergleicht es mit dem in der Datenbank. Muss noch umgesetzt werden

/**
 * Überprüft Passworteingabe bei der Anmeldung
 * @param {*} db Datenbankverbindung
 * @param {*} email Email-Adresse
 * @param {*} passwort im Form eingegebenes Passwort
 * @returns {Promise} - Gibt den erfolgreich angemeldeten Benutzer zurück
 */
const benutzerPruefen = async (db, email, passwort) => {
  try {
    const res = await db.query('SELECT * FROM benutzer WHERE email = $1', [
      email,
    ])
    if (res.rows.length === 0) {
      throw new Error('Benutzer nicht gefunden')
    }

    const pwHash = res.rows[0].passwort
    console.log('Passwort-Hash: ', pwHash)

    const result = await bcrypt.compare(passwort, pwHash)
    if (result) {
      console.log('Passwort ist korrekt')
      return res.rows[0] // Gibt den gefundenen Benutzer zurück
    } else {
      throw new Error('Falsches Passwort')
    }
  } catch (error) {
    console.log('Error: ', error)
    throw error // Wichtig: Weiterleiten des Fehlers an den Aufrufer
  }
}

/**
 * Falls Nutzer sein Passwort ändernt moechte
 * @param {*} db Datenbankverbindung
 * @param {*} benutzername Selbstgewählter Benutzername
 * @param {*} passwort Neues Passwort
 * @returns {Promise} - ausstehend
 */
const passwortAendern = async (db, benutzername, passwort) => {
  const res = await db.query(
    'UPDATE benutzer SET passwort = $1 WHERE benutzername= $2',
    [passwort, benutzername]
  )
  return res.rows
}

/**
 * Prüfen, ob der Benutzer existiert
 * @param {*} db Datenbankverbindung
 * @param {*} benutzername Selbstgewählter Benutzername
 * @param {*} email Hinterlegte Email-Adresse
 * @returns {Promise} - Gibt die gefundenen Benutzer zurück
 */
const benutzerExistiert = async (db, benutzername, email) => {
  const res = await db.query(
    'SELECT * FROM benutzer WHERE benutzername = $1 OR email = $2',
    [benutzername, email]
  )
  return res.rows
}

/**
 * gibt alle Touren von allen Benutzern zurück, genutzt für die Tourenübersicht da auch der Benutzername des Erstellers angezeigt werden soll
 * @param {*} db
 * @returns {Promise} - Gibt alle Touren zurück
 */
const getTouren = async (db) => {
  //const res = await db.query('SELECT * FROM touren')

  /* 
    SELECT 
    t.name,
    t.beschreibung,
    b.benutzername
FROM 
    touren t
INNER JOIN 
    benutzer b ON t.benutzer_id = b.id;
    */
  const res = await db.query(
    'SELECT t.id, t.name, t.beschreibung, b.benutzername FROM touren t INNER JOIN benutzer b ON t.benutzer_id = b.id'
  )

  return res.rows
}

/**
 * Tour basierend auf ID holen, übergeben in URL Parameter
 * @param {*} db Datenbankverbindung
 * @param {*} id ID der Tour in DB, meist in URL übergebne
 * @returns alle Felder der jeweiligen Tour
 */
const getTourById = async (db, id) => {
  const res = await db.query('SELECT * FROM touren WHERE id = $1', [id])
  return res.rows
}

/**
 * gibt alle Touren von einem bestimmten Benutzer zurück.
 * Verwendung: profil, benutzer/<benutzername>
 * @param {*} db
 * @param {*} benutzername
 * @returns {Promise} - Gibt alle Touren des Benutzers zurück
 */
const getTourenVonBenutzer = async (db, benutzername) => {
  const res = await db.query(
    'SELECT * FROM touren WHERE benutzer_id = (SELECT id FROM benutzer WHERE benutzername = $1)',
    [benutzername]
  )
  return res.rows
}

/**
 * Fügt eine Tour hinzu
 * @param {*} db Datenbankverbindung
 * @param {*} name Name der Tour
 * @param {*} beschreibung Beschreibung der Tour
 * @param {*} punkte JSON String von GPS Koordinaten, format: [{lat: 123, lng: 123}, ...]. Wird vorher stringified
 * @param {*} benutzer_id ID des Benutzers, der die Tour hinzufügt
 * @returns {Promise} - Gibt die hinzugefügte Tour zurück
 */
const tourHinzufuegen = async (db, name, beschreibung, punkte, benutzer_id) => {
  console.log(
    'DB aufruf mit:',
    'name:',
    name,
    'beschreibung:',
    beschreibung,
    'punkte:',
    punkte,
    'benutzer id:',
    benutzer_id
  )
  const res = await db.query(
    'INSERT INTO touren (name, beschreibung, punkte, benutzer_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, beschreibung, punkte, benutzer_id]
  )
  return res.rows[0]
}

/**
 * Genutzt, um bestehende Touren in hinsicht auf Punkte zu aktualisieren.
 * Genutzt in Bearbeiten von Touren im Profil bzw. POST: /tour-bearbeiten/:tourId
 * @param {*} db Datenbankverbindung
 * @param {*} tourId ID in der DB, selbe wie in der URL
 * @param {*} punkte JSON String von GPS Koordinaten, format: [{lat: 123, lng: 123}, ...]. Wird vorher stringified
 * @returns {Promise} - Gibt die aktualisierte Tour zurück
 */
const updateTour = async (db, tourId, punkte) => {
  const res = await db.query('UPDATE touren SET punkte = $1 WHERE id = $2', [
    punkte,
    tourId,
  ])
  return res.rows
}

/**
 * Loeschen einer Tour per ID, ausgeführt in /profil
 * @param {*} db Datenbankverbindung
 * @param {*} tourId ID der zu löschenden Tour
 * @returns {Promise} - Anzahl der gelöschten Einträge. Sollte 1 sein, wenn erfolgreich
 */
const tourLoeschen = async (db, tourId) => {
  const res = await db.query('DELETE FROM touren WHERE id = $1', [tourId])

  return res.rowCount
}

// Exportieren der Funktionen
module.exports = {
  benutzerAnlegen,
  getBenutzer,
  getBenutzerById,
  benutzerLoeschen,
  benutzerPruefen,
  passwortAendern,
  benutzerExistiert,
  getTouren,
  getTourById,
  getTourenVonBenutzer,
  tourHinzufuegen,
  updateTour,
  tourLoeschen,
}
