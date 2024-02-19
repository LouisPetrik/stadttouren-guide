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
    const pwHash = res.rows[0].passwort
    console.log('Passwort-Hash: ', pwHash)

    const result = await bcrypt.compare(passwort, pwHash)

    if (result) {
      console.log('Passwort ist korrekt')
      return res.rows // Hier muss die Logik für die erfolgreiche Authentifizierung stehen
    } else {
      console.log('Passwort ist falsch')
      // Hier könnte man einen Fehler werfen oder entsprechend reagieren
    }
  } catch (error) {
    console.log('Error: ', error)
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

// Exportieren der Funktionen
module.exports = {
  benutzerAnlegen,
  getBenutzer,
  getBenutzerById,
  benutzerLoeschen,
  benutzerPruefen,
  passwortAendern,
  benutzerExistiert,
}
