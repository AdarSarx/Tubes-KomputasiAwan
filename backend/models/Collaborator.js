const mongoose = require('mongoose')

const collaboratorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, trim: true, default: '' },
  company: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  avatar: { type: String, trim: true, default: '' },
  linkedin: { type: String, trim: true, default: '' },
  isPublic: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Collaborator', collaboratorSchema)
