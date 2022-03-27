/* eslint-disable camelcase */
const express = require('express')
const { JunctionTracker } = require('./models')

const app = express()
app.use(express.json())

const masarycka_id = 'U480Z3P'
const hlavak_id = 'U142Z1P'
const jindrisska_id = 'U203Z1P'

const junctionTracker = new JunctionTracker(jindrisska_id, hlavak_id, masarycka_id, [5, 25])
junctionTracker.update()

app.get('/junction-tracker/update', async (req, res) => {
  try {
    await junctionTracker.update()
    return res.json({ ok: true, state: junctionTracker.get_state() })
  } catch {
    return res.status(500).send({ ok: false })
  }
})

app.get('/junction-tracker/potential_saved_delay', async (req, res) => {
  // TODO return the calculated saved delay if the trams had followed our ordering
  try {
    const delay = await junctionTracker.get_saved_delay()
    return res.json({ ok: true, delay })
  } catch {
    return res.status(500).send({ ok: false })
  }
})

module.exports = app
