import { useEffect, useState } from 'react'
import { contacts as contactsApi, collaborators as collabsApi, health } from '../lib/api'

const EMPTY_COLLAB = { name: '', role: '', company: '', description: '', avatar: '', linkedin: '', isPublic: true }

export default function ContactManager({ onClose }) {
  const [tab, setTab] = useState('messages') // 'messages' | 'collaborators'
  const [dbStatus, setDbStatus] = useState('checking') // 'checking' | 'connected' | 'disconnected'

  useEffect(() => {
    health()
      .then((data) => setDbStatus(data.status === 'connected' ? 'connected' : 'disconnected'))
      .catch(() => setDbStatus('disconnected'))
  }, [])

  // ── Messages ──────────────────────────────────────────────────
  const [messages, setMessages] = useState([])
  const [msgLoading, setMsgLoading] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [deleteConfirmMsg, setDeleteConfirmMsg] = useState(null)

  useEffect(() => {
    if (tab !== 'messages') return
    setMsgLoading(true)
    contactsApi.getAll()
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setMsgLoading(false))
  }, [tab])

  const handleReadMsg = async (msg) => {
    setSelectedMsg(msg)
    if (!msg.isRead) {
      try {
        const updated = await contactsApi.markRead(msg._id)
        setMessages((prev) => prev.map((m) => (m._id === updated._id ? updated : m)))
      } catch { /* ignore */ }
    }
  }

  const handleDeleteMsg = async (id) => {
    try {
      await contactsApi.remove(id)
      setMessages((prev) => prev.filter((m) => m._id !== id))
      if (selectedMsg?._id === id) setSelectedMsg(null)
      setDeleteConfirmMsg(null)
    } catch { /* ignore */ }
  }

  // ── Collaborators ─────────────────────────────────────────────
  const [collabs, setCollabs] = useState([])
  const [collabLoading, setCollabLoading] = useState(true)
  const [collabMode, setCollabMode] = useState('list') // 'list' | 'create' | 'edit'
  const [editingCollab, setEditingCollab] = useState(null)
  const [collabForm, setCollabForm] = useState(EMPTY_COLLAB)
  const [deleteConfirmCollab, setDeleteConfirmCollab] = useState(null)

  useEffect(() => {
    if (tab !== 'collaborators') return
    setCollabLoading(true)
    collabsApi.getAll()
      .then(setCollabs)
      .catch(() => setCollabs([]))
      .finally(() => setCollabLoading(false))
  }, [tab])

  const openCreateCollab = () => {
    setCollabForm(EMPTY_COLLAB)
    setEditingCollab(null)
    setCollabMode('create')
  }

  const openEditCollab = (c) => {
    setCollabForm({ name: c.name, role: c.role, company: c.company, description: c.description, avatar: c.avatar, linkedin: c.linkedin, isPublic: c.isPublic })
    setEditingCollab(c)
    setCollabMode('edit')
  }

  const handleCollabSubmit = async (e) => {
    e.preventDefault()
    try {
      if (collabMode === 'create') {
        const created = await collabsApi.create(collabForm)
        setCollabs((prev) => [created, ...prev])
      } else {
        const updated = await collabsApi.update(editingCollab._id, collabForm)
        setCollabs((prev) => prev.map((c) => (c._id === updated._id ? updated : c)))
      }
      setCollabMode('list')
    } catch { /* ignore */ }
  }

  const handleDeleteCollab = async (id) => {
    try {
      await collabsApi.remove(id)
      setCollabs((prev) => prev.filter((c) => c._id !== id))
      setDeleteConfirmCollab(null)
    } catch { /* ignore */ }
  }

  const unreadCount = messages.filter((m) => !m.isRead).length

  return (
    <div className="pm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pm-panel cm-panel">
        {/* Header */}
        <div className="pm-header">
          <div className="cm-header-top">
            <div className="cm-tabs">
            <button className={`cm-tab${tab === 'messages' ? ' active' : ''}`} onClick={() => setTab('messages')}>
              Pesan Masuk
              {unreadCount > 0 && <span className="cm-badge">{unreadCount}</span>}
            </button>
            <button className={`cm-tab${tab === 'collaborators' ? ' active' : ''}`} onClick={() => setTab('collaborators')}>
              Kolaborator
            </button>
          </div>
            <span className={`cm-db-status cm-db-${dbStatus}`}>
              <span className="cm-db-dot" />
              {dbStatus === 'checking' ? 'Memeriksa...' : dbStatus === 'connected' ? 'MongoDB terhubung' : 'MongoDB tidak terhubung'}
            </span>
          </div>
          <div className="pm-header-actions">
            {tab === 'collaborators' && collabMode === 'list' && (
              <button className="button primary small" onClick={openCreateCollab}>+ Tambah</button>
            )}
            <button className="pm-close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        {/* ── Messages Tab ── */}
        {tab === 'messages' && (
          <div className="cm-messages-layout">
            <div className="cm-msg-list">
              {msgLoading && <p className="pm-empty">Memuat...</p>}
              {!msgLoading && messages.length === 0 && <p className="pm-empty">Belum ada pesan masuk.</p>}
              {messages.map((msg) => (
                <button
                  key={msg._id}
                  className={`cm-msg-item${selectedMsg?._id === msg._id ? ' selected' : ''}${!msg.isRead ? ' unread' : ''}`}
                  onClick={() => handleReadMsg(msg)}
                >
                  <div className="cm-msg-avatar">{msg.name?.[0]?.toUpperCase() ?? '?'}</div>
                  <div className="cm-msg-meta">
                    <p className="cm-msg-name">{msg.name}</p>
                    <p className="cm-msg-subject">{msg.subject || msg.email}</p>
                    <p className="cm-msg-date">{new Date(msg.createdAt).toLocaleDateString('id-ID')}</p>
                  </div>
                  {!msg.isRead && <span className="cm-unread-dot" />}
                </button>
              ))}
            </div>

            <div className="cm-msg-detail">
              {!selectedMsg ? (
                <p className="pm-empty cm-detail-placeholder">Pilih pesan untuk membacanya</p>
              ) : (
                <>
                  <div className="cm-detail-header">
                    <div>
                      <h3 className="cm-detail-name">{selectedMsg.name}</h3>
                      <p className="cm-detail-email">{selectedMsg.email}</p>
                    </div>
                    <div className="pm-item-actions">
                      {deleteConfirmMsg === selectedMsg._id ? (
                        <div className="pm-confirm">
                          <span>Hapus?</span>
                          <button className="button small pm-btn-danger" onClick={() => handleDeleteMsg(selectedMsg._id)}>Ya</button>
                          <button className="button ghost small" onClick={() => setDeleteConfirmMsg(null)}>Batal</button>
                        </div>
                      ) : (
                        <button className="button small pm-btn-danger" onClick={() => setDeleteConfirmMsg(selectedMsg._id)}>Hapus</button>
                      )}
                    </div>
                  </div>
                  {selectedMsg.subject && <p className="cm-detail-subject"><strong>Subjek:</strong> {selectedMsg.subject}</p>}
                  <p className="cm-detail-date">{new Date(selectedMsg.createdAt).toLocaleString('id-ID')}</p>
                  <div className="cm-detail-body">{selectedMsg.message}</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Collaborators Tab ── */}
        {tab === 'collaborators' && collabMode === 'list' && (
          <div className="pm-list">
            {collabLoading && <p className="pm-empty">Memuat...</p>}
            {!collabLoading && collabs.length === 0 && <p className="pm-empty">Belum ada kolaborator.</p>}
            {collabs.map((c) => (
              <div key={c._id} className="pm-item">
                <div className="pm-item-thumb cm-collab-thumb">
                  {c.avatar ? <img src={c.avatar} alt={c.name} /> : <span>{c.name?.[0]?.toUpperCase()}</span>}
                </div>
                <div className="pm-item-info">
                  <p className="pm-item-title">{c.name}</p>
                  <p className="pm-item-stack">{c.role}{c.company ? ` · ${c.company}` : ''}</p>
                  {!c.isPublic && <span className="cm-hidden-tag">Tersembunyi</span>}
                </div>
                <div className="pm-item-actions">
                  <button className="button ghost small" onClick={() => openEditCollab(c)}>Edit</button>
                  {deleteConfirmCollab === c._id ? (
                    <div className="pm-confirm">
                      <span>Hapus?</span>
                      <button className="button small pm-btn-danger" onClick={() => handleDeleteCollab(c._id)}>Ya</button>
                      <button className="button ghost small" onClick={() => setDeleteConfirmCollab(null)}>Batal</button>
                    </div>
                  ) : (
                    <button className="button small pm-btn-danger" onClick={() => setDeleteConfirmCollab(c._id)}>Hapus</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'collaborators' && (collabMode === 'create' || collabMode === 'edit') && (
          <form className="pm-form" onSubmit={handleCollabSubmit}>
            <label className="pm-label">
              Nama *
              <input className="pm-input" value={collabForm.name} onChange={(e) => setCollabForm((p) => ({ ...p, name: e.target.value }))} placeholder="Nama kolaborator" required />
            </label>
            <label className="pm-label">
              Role / Posisi
              <input className="pm-input" value={collabForm.role} onChange={(e) => setCollabForm((p) => ({ ...p, role: e.target.value }))} placeholder="e.g. UI/UX Designer" />
            </label>
            <label className="pm-label">
              Perusahaan / Institusi
              <input className="pm-input" value={collabForm.company} onChange={(e) => setCollabForm((p) => ({ ...p, company: e.target.value }))} placeholder="e.g. Telkom University" />
            </label>
            <label className="pm-label">
              Deskripsi Kolaborasi
              <textarea className="pm-input" rows={2} value={collabForm.description} onChange={(e) => setCollabForm((p) => ({ ...p, description: e.target.value }))} placeholder="Proyek atau kerja sama yang pernah dilakukan..." />
            </label>
            <label className="pm-label">
              URL Foto / Avatar
              <input className="pm-input" type="url" value={collabForm.avatar} onChange={(e) => setCollabForm((p) => ({ ...p, avatar: e.target.value }))} placeholder="https://..." />
            </label>
            <label className="pm-label">
              LinkedIn URL
              <input className="pm-input" type="url" value={collabForm.linkedin} onChange={(e) => setCollabForm((p) => ({ ...p, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..." />
            </label>
            <label className="pm-label cm-checkbox-label">
              <input type="checkbox" checked={collabForm.isPublic} onChange={(e) => setCollabForm((p) => ({ ...p, isPublic: e.target.checked }))} />
              Tampilkan di portofolio publik
            </label>
            <div className="pm-form-actions">
              <button type="submit" className="button primary">{collabMode === 'create' ? 'Tambah Kolaborator' : 'Simpan'}</button>
              <button type="button" className="button ghost" onClick={() => setCollabMode('list')}>Batal</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
