// const { Pool } = require('pg')

// nutzer in die datenbank schreiben
const benutzerAnlegen = async (pool, benutzername, passwort, email) => {
  const res = await pool.query(
    'INSERT INTO benutzer (benutzername, passwort, email) VALUES ($1, $2, $3) RETURNING *',
    [benutzername, passwort, email]
  )
  return res.rows[0]
}

// write a function that returns all users from the database
const getBenutzer = async (pool) => {
  const res = await pool.query('SELECT * FROM benutzer')
  return res.rows
}

// Dafür, wenn der Nutzer seinen account schließen will
const benutzerLoeschen = async (pool, benutzername) => {
  const res = await pool.query('DELETE FROM benutzer WHERE benutzername = $1', [
    benutzername,
  ])
  return res.rows
}

// Passwort prüfung bei der Anmeldung. Hasht das Passwort und vergleicht es mit dem in der Datenbank
const passwortPruefen = async (pool, benutzername, passwort) => {
  const res = await pool.query(
    'SELECT * FROM benutzer WHERE benutzername = $1 AND passwort = $2',
    [benutzername, passwort]
  )
  return res.rows
}

// Passwort ändern
const passwortAendern = async (pool, benutzername, passwort) => {
  const res = await pool.query(
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
