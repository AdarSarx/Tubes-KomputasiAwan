import { useState } from 'react'

const EMPTY_FORM = {
  title: '',
  stack: '',
  description: '',
  tag: '',
  image: '',
}

export default function ProjectManager({ projects, onAdd, onUpdate, onDelete, onClose }) {
  const [mode, setMode] = useState('list') // 'list' | 'create' | 'edit'
  const [editingProject, setEditingProject] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditingProject(null)
    setMode('create')
  }

  const openEdit = (project) => {
    setForm({
      title: project.title,
      stack: project.stack,
      description: project.description,
      tag: project.tag,
      image: typeof project.image === 'string' && project.image.startsWith('http') ? project.image : '',
    })
    setEditingProject(project)
    setMode('edit')
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    const payload = {
      ...form,
      title: form.title.trim(),
      stack: form.stack.trim(),
      description: form.description.trim(),
      tag: form.tag.trim(),
      image: form.image.trim() || null,
    }

    if (mode === 'create') {
      onAdd({ ...payload, id: Date.now().toString() })
    } else {
      onUpdate({ ...editingProject, ...payload })
    }
    setMode('list')
  }

  const handleDelete = (id) => {
    onDelete(id)
    setDeleteConfirm(null)
  }

  return (
    <div className="pm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pm-panel">
        <div className="pm-header">
          <h2>{mode === 'list' ? 'Manage Projects' : mode === 'create' ? 'Add Project' : 'Edit Project'}</h2>
          <div className="pm-header-actions">
            {mode === 'list' && (
              <button className="button primary small" onClick={openCreate}>
                + Add Project
              </button>
            )}
            <button className="pm-close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        {mode === 'list' && (
          <div className="pm-list">
            {projects.length === 0 && (
              <p className="pm-empty">No projects yet. Click "Add Project" to get started.</p>
            )}
            {projects.map((p, i) => (
              <div key={p.id ?? p.title} className="pm-item">
                <div className="pm-item-thumb">
                  {p.image ? (
                    <img src={p.image} alt={p.title} />
                  ) : (
                    <div className={`pm-thumb-placeholder thumb-${(i % 6) + 1}`} />
                  )}
                </div>
                <div className="pm-item-info">
                  <p className="pm-item-title">{p.title}</p>
                  <p className="pm-item-stack">{p.stack}</p>
                  <span className="project-tag">{p.tag}</span>
                </div>
                <div className="pm-item-actions">
                  <button className="button ghost small" onClick={() => openEdit(p)}>Edit</button>
                  {deleteConfirm === (p.id ?? p.title) ? (
                    <div className="pm-confirm">
                      <span>Hapus?</span>
                      <button className="button small pm-btn-danger" onClick={() => handleDelete(p.id ?? p.title)}>Ya</button>
                      <button className="button ghost small" onClick={() => setDeleteConfirm(null)}>Batal</button>
                    </div>
                  ) : (
                    <button className="button small pm-btn-danger" onClick={() => setDeleteConfirm(p.id ?? p.title)}>
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {(mode === 'create' || mode === 'edit') && (
          <form className="pm-form" onSubmit={handleSubmit}>
            <label className="pm-label">
              Judul Proyek *
              <input
                className="pm-input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Be-Healthy"
                required
              />
            </label>
            <label className="pm-label">
              Tech Stack
              <input
                className="pm-input"
                name="stack"
                value={form.stack}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </label>
            <label className="pm-label">
              Deskripsi
              <textarea
                className="pm-input"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Deskripsi singkat proyek..."
                rows={3}
              />
            </label>
            <label className="pm-label">
              Tag / Kategori
              <input
                className="pm-input"
                name="tag"
                value={form.tag}
                onChange={handleChange}
                placeholder="e.g. Fullstack, UI/UX Design"
              />
            </label>
            <label className="pm-label">
              URL Gambar
              <input
                className="pm-input"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                type="url"
              />
            </label>
            {form.image && (
              <img className="pm-preview" src={form.image} alt="preview" />
            )}
            <div className="pm-form-actions">
              <button type="submit" className="button primary">
                {mode === 'create' ? 'Tambah Proyek' : 'Simpan Perubahan'}
              </button>
              <button type="button" className="button ghost" onClick={() => setMode('list')}>
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
