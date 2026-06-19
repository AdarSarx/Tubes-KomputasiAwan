const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api'

const req = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const health = () => req('/health')

export const contacts = {
  create: (data) => req('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => req('/contacts'),
  markRead: (id) => req(`/contacts/${id}/read`, { method: 'PATCH' }),
  remove: (id) => req(`/contacts/${id}`, { method: 'DELETE' }),
}

export const collaborators = {
  getPublic: () => req('/collaborators'),
  getAll: () => req('/collaborators?all=1'),
  create: (data) => req('/collaborators', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => req(`/collaborators/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => req(`/collaborators/${id}`, { method: 'DELETE' }),
}
