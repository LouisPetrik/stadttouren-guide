// const { db } = require('pg')

// nutzer in die datenbank schreiben
const benutzerAnlegen = async (db, benutzername, passwort, email) => {
  const res = await db.query(
    'INSERT INTO benutzer (benutzername, passwort, email) VALUES ($1, $2, $3) RETURNING *',
    [benutzername, passwort, email]
  )
  return res.rows[0]
}

// write a function that returns all users from the database
const getBenutzer = async (db) => {
  const res = await db.query('SELECT * FROM benutzer')
  return res.rows
}

// Dafür, wenn der Nutzer seinen account schließen will
const benutzerLoeschen = async (db, benutzername) => {
  const res = await db.query('DELETE FROM benutzer WHERE benutzername = $1', [
    benutzername,
  ])
  return res.rows
}

// Passwort prüfung bei der Anmeldung. Hasht das Passwort und vergleicht es mit dem in der Datenbank
const passwortPruefen = async (db, benutzername, passwort) => {
  const res = await db.query(
    'SELECT * FROM benutzer WHERE benutzername = $1 AND passwort = $2',
    [benutzername, passwort]
  )
  return res.rows
}

// Passwort ändern
const passwortAendern = async (db, benutzername, passwort) => {
  const res = await db.query(
    'UPDATE benutzer SET passwort = $1 WHERE benutzername= $2',
    [passwort, benutzername]
  )
  return res.rows
}

// Exportieren der Funktionen
module.exports = {
  benutzerAnlegen,
  getBenutzer,
  benutzerLoeschen,
  passwortPruefen,
  passwortAendern,
}
