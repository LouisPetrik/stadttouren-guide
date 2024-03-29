/**
 * Entwernt einen Wegpunkt aus der Liste der Wegpunkte
 * @param {array} index in der Liste der Wegpunkte
 */
function removeWaypoint(index) {
  var waypoints = routingControl.getWaypoints()
  if (waypoints.length > 2) {
    // Verhindern, dass die letzten zwei Wegpunkte entfernt werden
    waypoints.splice(index, 1)
    routingControl.setWaypoints(waypoints)
  }

  toggleSpeichernButtonAktiviert()
}

/**
 * Gibt die URL des OSRM-Services zurück, abhängig davon, ob die Anwendung lokal oder auf Domain läuft
 * @returns {string} URL des OSRM-Services
 * Caddy leitet alles auf /route an OSRM weiter. Lokal über port 80, sonst über 443 da https dann aktiv.
 */
function getServiceURL() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost/route/v1'
  } else {
    return 'https://stadttouren.online/route/v1'
  }
}

/**
 * Gibt die Koordinaten der Wegpunkte zurück, als Array von Objekten mit lat und lng
 * @returns {array} Array mit Koordinaten der Wegpunkte
 */
function getPunkte() {
  var waypoints = routingControl.getWaypoints()
  var punkte = []
  for (var i = 0; i < waypoints.length; i++) {
    punkte.push(waypoints[i].latLng)
  }
  return punkte
}

/**
 * Berechnet die Distanz und Dauer der Tour
 * @param {*} e
 */
function tourDaten(e) {
  const routes = e.routes
  const summary = routes[0].summary
  distanz = summary.totalDistance

  dauer = Math.round(summary.totalTime / 60, 2)
}
