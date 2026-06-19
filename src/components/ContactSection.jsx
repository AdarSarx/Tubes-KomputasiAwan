import { useState } from 'react'
import { contacts as contactsApi } from '../lib/api'

const EMPTY = { name: '', email: '', subject: '', message: '' }

export default function ContactSection() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await contactsApi.create(form)
      setStatus('success')
      setForm(EMPTY)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Gagal mengirim pesan. Pastikan server berjalan.')
    }
  }

  return (
    <section id="contact" className="section alt">
      <div className="container two-col">
        <div>
          <p className="section-kicker">Get In Touch</p>
          <h2 className="section-title"><span>Contact</span> Me</h2>
          <p>Punya ide proyek, pertanyaan, atau ingin berkolaborasi? Saya selalu terbuka untuk diskusi baru.</p>
          <div className="contact-links">
            <a className="contact-link-item" href="mailto:adar.sarx@gmail.com">
              <span className="contact-link-icon">✉</span>
              adar.sarx@gmail.com
            </a>
            <a className="contact-link-item" href="https://github.com/AdarSarx" target="_blank" rel="noopener noreferrer">
              <span className="contact-link-icon">gh</span>
              github.com/AdarSarx
            </a>
            <a className="contact-link-item" href="https://www.linkedin.com/in/adar-sarx" target="_blank" rel="noopener noreferrer">
              <span className="contact-link-icon">in</span>
              LinkedIn
            </a>
          </div>
        </div>

        <div className="card contact-card">
          {status === 'success' ? (
            <div className="contact-success">
              <div className="contact-success-icon">✓</div>
              <h3>Pesan Terkirim!</h3>
              <p>Terima kasih sudah menghubungi saya. Saya akan membalas secepatnya.</p>
              <button className="button ghost" onClick={() => setStatus('idle')}>Kirim pesan lain</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <label className="pm-label">
                Nama *
                <input className="pm-input" name="name" value={form.name} onChange={handleChange} placeholder="Nama kamu" required />
              </label>
              <label className="pm-label">
                Email *
                <input className="pm-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" required />
              </label>
              <label className="pm-label">
                Subjek
                <input className="pm-input" name="subject" value={form.subject} onChange={handleChange} placeholder="Tentang apa?" />
              </label>
              <label className="pm-label">
                Pesan *
                <textarea className="pm-input" name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Tulis pesan kamu di sini..." required />
              </label>
              {status === 'error' && <p className="contact-error">{errorMsg}</p>}
              <button type="submit" className="button primary" disabled={status === 'loading'}>
                {status === 'loading' ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
