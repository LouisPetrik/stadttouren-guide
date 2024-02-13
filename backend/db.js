const { Pool } = require('pg')
const pool = new Pool({
  user: 'meinBenutzer',
  host: 'localhost',
  database: 'meineDatenbank',
  password: 'meinPasswort',
  port: 5432,
})

// nutzer in die datenbank schreiben
const benutzerAnlegen = async (email, passwort, benutzername) => {
  const res = await pool.query(
    'INSERT INTO benutzer (benutzername, email, passwort) VALUES ($1, $2, $3) RETURNING *',
    [benutzername, email, passwort]
  )
  return res.rows[0]
}

// write a function that returns all users from the database
const getUsers = async () => {
  const res = await pool.query('SELECT * FROM benutzer')
  return res.rows
}

if (true) {
  benutzerAnlegen('test@mail.com', '123456', 'testnutzer')
    .then((res) => console.log(res))
    .catch((e) => console.error(e.stack))
}

getUsers().then((res) => console.log(res))
