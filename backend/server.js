require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Contact = require('./models/Contact')
const Collaborator = require('./models/Collaborator')

const app = express()
const PORT = process.env.PORT || 3001

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err))

// ── Contact routes ──────────────────────────────────────────────

app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, dan message wajib diisi' })
    }
    const contact = await Contact.create({ name, email, subject, message })
    res.status(201).json(contact)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json(contacts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/contacts/:id/read', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    )
    if (!contact) return res.status(404).json({ error: 'Not found' })
    res.json(contact)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Collaborator routes ─────────────────────────────────────────

app.get('/api/collaborators', async (req, res) => {
  try {
    const filter = req.query.all === '1' ? {} : { isPublic: true }
    const collaborators = await Collaborator.find(filter).sort({ createdAt: -1 })
    res.json(collaborators)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/collaborators', async (req, res) => {
  try {
    const { name, role, company, description, avatar, linkedin, isPublic } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })
    const collab = await Collaborator.create({ name, role, company, description, avatar, linkedin, isPublic })
    res.status(201).json(collab)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/collaborators/:id', async (req, res) => {
  try {
    const collab = await Collaborator.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!collab) return res.status(404).json({ error: 'Not found' })
    res.json(collab)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/collaborators/:id', async (req, res) => {
  try {
    await Collaborator.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/health', (req, res) => {
  const state = mongoose.connection.readyState
  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const map = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
  res.json({ status: map[state] ?? 'unknown', state })
})

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
