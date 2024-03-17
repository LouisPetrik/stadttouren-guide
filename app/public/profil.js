/**
 * Umschreiben von Name oder Beschreibung
 * @param {HTMLElement} el - Das Element, das umbenannt werden soll
 * @param {string} art - 'name' oder 'beschreibung', je nachdem, was umbenannt werden soll
 */
function metadatenAendern(el, art) {
  // bisheriger Name
  const textContentAktuell = el.textContent

  const promptFrage =
    art === 'name' ? 'Neuer Name der Tour:' : 'Neue Beschreibung der Tour:'
  // Mit Alert nach dem Namen fragen
  const textContentNeu = prompt(promptFrage, textContentAktuell)

  // Wenn der Nutzer auf Abbrechen klickt, wird nichts gemacht
  if (textContentNeu === null) {
    return
  }

  // Ansonsten wird neuer Name / Beschreibung an Server geschickt

  // POST request an den Server
  fetch('/tour-metadaten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tourId: el.getAttribute('data-tour-id'),
      art: art,
      text: textContentNeu,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Erfolgreich:', data)
      // Seite neu laden, damit Änderungen wirksam werden
      window.location.reload()
    })
}

/**
 * Loeschen einer Tour
 * @param {HTMLElement} button
 */
function tourLoeschen(button) {
  // POST request an den Server zur loeschung
  fetch('/tour-loeschen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tourId: button.getAttribute('data-tour-id'),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Erfolgreich:', data)
      // Seite neu laden
      window.location.reload()
    })
}
