const express = require('express')

const { getTouren } = require('../db')
const router = express.Router()

router.get('/touren', async (req, res) => {
  const tourenListe = await getTouren(req.db)
  console.log('Tourenliste: ', tourenListe)
  res.render('touren', { touren: tourenListe })
})

module.exports = router
