/**
 * GPS-Tracking, wird ausgeführt im Interval
 * @return {void}
 */
function positionAbfragen() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      // Update marker position
      GPSmarker.setLatLng(L.latLng(lat, lng))

      // Update routing (if applicable)
      if (routingControl) {
        // War vorher routingControl.setWaypoints[0]
        routingControl.getWaypoints()[0] = L.latLng(lat, lng)
      }
    },
    (error) => {
      // Handle location error
      console.error(error)
    }
  )
}
