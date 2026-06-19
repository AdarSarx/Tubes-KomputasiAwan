import { useEffect, useState } from 'react'
import { collaborators as collabsApi } from '../lib/api'

export default function CollaboratorsSection() {
  const [collabs, setCollabs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    collabsApi.getPublic()
      .then(setCollabs)
      .catch(() => setCollabs([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && collabs.length === 0) return null

  return (
    <section id="collaborators" className="section">
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Network & Collaborations</p>
          <h2 className="section-title"><span>Jalinan</span> Kerja Sama</h2>
          <p>Orang-orang hebat yang pernah berkolaborasi bersama saya dalam berbagai proyek.</p>
        </div>

        {loading ? (
          <div className="collab-loading">Memuat kolaborator...</div>
        ) : (
          <div className="collab-grid">
            {collabs.map((c) => (
              <div key={c._id} className="card collab-card">
                <div className="collab-avatar">
                  {c.avatar
                    ? <img src={c.avatar} alt={c.name} />
                    : <span>{c.name?.[0]?.toUpperCase()}</span>
                  }
                </div>
                <div className="collab-info">
                  <h3 className="collab-name">{c.name}</h3>
                  {c.role && <p className="collab-role">{c.role}</p>}
                  {c.company && <p className="stack">{c.company}</p>}
                  {c.description && <p className="collab-desc">{c.description}</p>}
                  {c.linkedin && (
                    <a className="collab-linkedin" href={c.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
