// Für die Verbindung zum Server, also Speichern und Bearbeiten von Touren
/**
 *
 * @param {*} tourID ID in der DB, selbe wie in der URL
 * @param {*} punkte Array von GPS Koordinaten
 */
function tourUpdaten(tourID, punkte) {
  // POST request zum Server
  fetch('/tour-bearbeiten/' + tourID, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ punkte }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Erfolgreich:', data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
