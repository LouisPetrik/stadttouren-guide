const { Pool } = require('pg')

// Anlegen der Verbindung
const pool = new Pool({
  user: 'meinBenutzer',
  host: 'localhost',
  database: 'meineDatenbank',
  password: 'meinPasswort',
  port: 5432,
})

// nutzer in die datenbank schreiben
const benutzerAnlegen = async (benutzername, passwort, email) => {
  const res = await pool.query(
    'INSERT INTO benutzer (benutzername, passwort, email) VALUES ($1, $2, $3) RETURNING *',
    [benutzername, passwort, email]
  )
  return res.rows[0]
}

// write a function that returns all users from the database
const getBenutzer = async () => {
  const res = await pool.query('SELECT * FROM benutzer')
  return res.rows
}

// Dafür, wenn der Nutzer seinen account schließen will
const benutzerLoeschen = async (benutzername) => {
  const res = await pool.query('DELETE FROM benutzer WHERE benutzername = $1', [
    benutzername,
  ])
  return res.rows
}

// Passwort prüfung bei der Anmeldung
const passwortPruefen = async (benutzername, passwort) => {
  const res = await pool.query(
    'SELECT * FROM benutzer WHERE benutzername = $1 AND passwort = $2',
    [benutzername, passwort]
  )
  return res.rows
}

// Passwort ändern
const passwortAendern = async (benutzername, passwort) => {
  const res = await pool.query(
    'UPDATE benutzer SET passwort = $1 WHERE benutzername= $2',
    [passwort, benutzername]
  )
  return res.rows
}

getBenutzer().then((res) => console.log(res))

// Exportieren der Funktionen
module.exports = {
  benutzerAnlegen,
  getBenutzer,
  benutzerLoeschen,
}
