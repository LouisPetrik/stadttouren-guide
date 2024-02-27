// const { db } = require('pg')
const bcrypt = require('bcrypt')

// nutzer in die datenbank schreiben
const benutzerAnlegen = async (db, benutzername, passwort, email) => {
  const res = await db.query(
    'INSERT INTO benutzer (benutzername, passwort, email) VALUES ($1, $2, $3) RETURNING *',
    [benutzername, passwort, email]
  )
  return res.rows[0]
}

// TEST: Dafür da alle benutzer auszugeben
const getBenutzer = async (db) => {
  const res = await db.query('SELECT * FROM benutzer')
  return res.rows
}

// Wird genutzt um beim Authentifizieren den Benutzer zu holen
const getBenutzerById = async (db, id) => {
  const res = await db.query('SELECT * FROM benutzer WHERE id = $1', [id])
  return res.rows
}

// Dafür, wenn der Nutzer seinen account schließen will
// Sollte vielleicht auf email umgestellt werden
const benutzerLoeschen = async (db, benutzername) => {
  const res = await db.query('DELETE FROM benutzer WHERE benutzername = $1', [
    benutzername,
  ])
  return res.rows
}

// Passwort prüfung bei der Anmeldung. Hasht das Passwort und vergleicht es mit dem in der Datenbank. Muss noch umgesetzt werden
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

// Passwort ändern
const passwortAendern = async (db, benutzername, passwort) => {
  const res = await db.query(
    'UPDATE benutzer SET passwort = $1 WHERE benutzername= $2',
    [passwort, benutzername]
  )
  return res.rows
}

const benutzerExistiert = async (db, benutzername, email) => {
  const res = await db.query(
    'SELECT * FROM benutzer WHERE benutzername = $1 OR email = $2',
    [benutzername, email]
  )
  return res.rows
}

// Alle Touren mit Benutzernamen von dem Ersteller ausgeben. Genutzt in: touren.handlebars /touren
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
    'SELECT t.name, t.urlpath, t.beschreibung, b.benutzername FROM touren t INNER JOIN benutzer b ON t.benutzer_id = b.id'
  )

  return res.rows
}

// Nur Touren von einem bestimmten Benutzer ausgeben (basierend auf Benutzername)
// Verwendung: profil, benutzer/<benutzername>
const getTourenVonBenutzer = async (db, benutzername) => {
  const res = await db.query(
    'SELECT * FROM touren WHERE benutzer_id = (SELECT id FROM benutzer WHERE benutzername = $1)',
    [benutzername]
  )
  return res.rows
}

const tourHinzufuegen = async (
  db,
  name,
  urlpath,
  beschreibung,
  benutzer_id
) => {
  const res = await db.query(
    'INSERT INTO touren (name, urlpath, beschreibung, benutzer_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, urlpath, beschreibung, benutzer_id]
  )
  return res.rows[0]
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
  getTourenVonBenutzer,
  tourHinzufuegen,
}
