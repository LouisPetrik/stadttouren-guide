// Für die Verbindung zum Server, also Speichern und Bearbeiten von Touren
/**
 *
 * @param {*} tourID ID in der DB, selbe wie in der URL
 * @param {*} punkte Array von GPS Koordinaten
 */
function tourUpdaten(tourID, punkte) {
  fetch(`/api/touren/${tourId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Erfolgreich geupdated:', data)
      // Hier kannst du weitere Aktionen durchführen, z.B. eine Erfolgsmeldung anzeigen
    })
    .catch((error) => {
      console.error('Fehler beim Updaten der Tour:', error)
      // Hier kannst du Fehlerbehandlung durchführen
    })
}
