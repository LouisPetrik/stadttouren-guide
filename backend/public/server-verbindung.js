// Für die Verbindung zum Server, also Speichern und Bearbeiten von Touren

/**
 * Wird sowohl beim Bearbeiten von Touren als auch beim Neu-Erstellen von Touren genutzt.
 * Getriggert über "Speichern" Button
 * @param {*} tourID ID in der DB, selbe wie in der URL
 * @param {*} punkte Array von GPS Koordinaten
 */
function tourUpdaten() {
  // ID aus URL holen
  const tourID = window.location.pathname.split('/').pop()
  console.log('Tour ID beim Updaten / Speichern: ', tourID)
  // POST request zum Server
  fetch('/tour-bearbeiten/' + tourID, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ punkte: getPunkte() }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Erfolgreich:', data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
