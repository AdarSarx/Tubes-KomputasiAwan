
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import presT from './assets/PresT.jpg'
import Behealthy from './assets/Behealthy.jpg'
import adarImg from './assets/adar.jpg'
import reactIcon from './assets/react.svg'
import Reservasi from './assets/Reservasi.png'
import Mido from './assets/Mido.jpg'
import Himpunan from './assets/himpunan.jpg'
import Devfest from './assets/devfest.jpg'
import pkl1 from './assets/pkl1.png'
import pkl from './assets/pkl.png'
import pengabdian from './assets/pengabdian.jpg'
import studium from './assets/studium.jpg'
import studium1 from './assets/studium1.jpg'
import ProjectManager from './components/ProjectManager'
import ContactManager from './components/ContactManager'
import ContactSection from './components/ContactSection'
import CollaboratorsSection from './components/CollaboratorsSection'

const DEFAULT_PROJECTS = (presT, Behealthy, Reservasi, Mido) => [
  { id: '1', title: 'PresT', stack: 'Figma', description: 'Website untuk manajement poin keaktifan siswa SMK Telkom Makassar', tag: 'UI/UX Design', image: presT },
  { id: '2', title: 'Be-Healthy', stack: 'Tailwind, Laravel, MongoDB', description: 'Website penjualan produk kesehatan dengan fitur rekomendasi berbasis preferensi pengguna untuk update stok real-time dan juga memiliki fitur cek kesehatan.', tag: 'UI/UX Design, Fullstack', image: Behealthy },
  { id: '3', title: 'Reservasi Restorant', stack: 'Java, MySQL', description: 'Website untuk reservasi restoran dengan fitur pemesanan meja secara online dan manajemen menu.', tag: 'UI/UX Design, Fullstack', image: Reservasi },
  { id: '4', title: 'MIDO Smart Plant', stack: 'Arduino, C++', description: 'Website untuk monitoring dan kontrol sistem irigasi otomatis berbasis IoT dengan fitur pemantauan kelembaban tanah dan pengaturan jadwal penyiraman.', tag: 'IoT', image: Mido },
]

function App() {
  const [theme, setTheme] = useState('light')
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [adminPanel, setAdminPanel] = useState('projects') // 'projects' | 'contacts'

  const openProjectAdmin = () => { setAdminPanel('projects'); setIsAdminOpen(true) }
  const openContactAdmin = () => { setAdminPanel('contacts'); setIsAdminOpen(true) }

  const defaultProjects = useMemo(() => DEFAULT_PROJECTS(presT, Behealthy, Reservasi, Mido), [])

  const [projects, setProjects] = useState(() => {
    try {
      const stored = localStorage.getItem('portfolio_projects')
      if (stored) {
        const parsed = JSON.parse(stored)
        const defaultMap = Object.fromEntries(DEFAULT_PROJECTS(presT, Behealthy, Reservasi, Mido).map((p) => [p.id, p]))
        return parsed.map((p) => ({
          ...p,
          image: (defaultMap[p.id] && !p.image?.startsWith('http')) ? defaultMap[p.id].image : p.image,
        }))
      }
    } catch { /* ignore */ }
    return DEFAULT_PROJECTS(presT, Behealthy, Reservasi, Mido)
  })

  const handleAddProject = (project) => {
    setProjects((prev) => {
      const updated = [...prev, project]
      localStorage.setItem('portfolio_projects', JSON.stringify(updated.map((p) => ({ ...p, image: p.image?.startsWith?.('http') ? p.image : null }))))
      return updated
    })
  }

  const handleUpdateProject = (updated) => {
    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id !== updated.id) return p
        const defaultImg = defaultProjects.find((d) => d.id === updated.id)?.image
        return { ...updated, image: updated.image || defaultImg || null }
      })
      localStorage.setItem('portfolio_projects', JSON.stringify(next.map((p) => ({ ...p, image: p.image?.startsWith?.('http') ? p.image : null }))))
      return next
    })
  }

  const handleDeleteProject = (id) => {
    setProjects((prev) => {
      const next = prev.filter((p) => (p.id ?? p.title) !== id)
      localStorage.setItem('portfolio_projects', JSON.stringify(next.map((p) => ({ ...p, image: p.image?.startsWith?.('http') ? p.image : null }))))
      return next
    })
  }

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      setTheme(saved)
      document.documentElement.dataset.theme = saved
      return
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = prefersDark ? 'dark' : 'light'
    setTheme(initialTheme)
    document.documentElement.dataset.theme = initialTheme
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  // Scroll-spy / active nav link handling
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section[id]'))
    const navLinks = Array.from(document.querySelectorAll('.nav-links a'))

    if (!sections.length || !navLinks.length) return

    // click handler for immediate feedback
    const onClick = (e) => {
      navLinks.forEach((l) => l.classList.remove('active'))
      e.currentTarget.classList.add('active')
    }

    navLinks.forEach((link) => link.addEventListener('click', onClick))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id
          const link = document.querySelector(`.nav-links a[href="#${id}"]`)
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'))
            if (link) link.classList.add('active')
          }
        })
      },
      { root: null, rootMargin: '0px 0px -40% 0px', threshold: 0.2 },
    )

    sections.forEach((s) => observer.observe(s))

    return () => {
      observer.disconnect()
      navLinks.forEach((link) => link.removeEventListener('click', onClick))
    }
  }, [])

  const skills = useMemo(
    () => [
      {
        title: 'Programming Language',
        icon: '💻',
        items: [
          { name: 'JavaScript', level: 75 },
          { name: 'PHP', level: 75 },
          { name: 'Python', level: 65 },
          { name: 'Java', level: 70 },
          { name: 'C/C++', level: 70 },
          { name: 'Golang', level: 77 },
        ],
      },
      {
        title: 'Framework & Libraries',
        icon: '🧩',
        items: [
          { name: 'Laravel', level: 75 },
          { name: 'Node.js', level: 70 },
          { name: 'Express', level: 74 },
          { name: 'Flutter', level: 63 },
        ],
      },
      {
        title: 'Database & Tools',
        icon: '🗃️',
        items: [
          { name: 'MySQL', level: 88 },
          { name: 'MongoDB', level: 85 },
          { name: 'Git & GitHub', level: 75 },
          
        ],
      },
      {
        title: 'Design & Dev Tools',
        icon: '🎨',
        items: [
          { name: 'Figma', level: 85 },
          { name: 'Canva', level: 90 },
          { name: 'VS Code', level: 83 },
          { name: 'Netbeans IDE', level: 68 },
          { name: 'Dev C/C++', level: 76 },
          { name: 'Arduino IDE', level: 76 },
        ],
      },
    ],
    [],
  )

  const experiences = useMemo(
    () => [
      {
        role: 'IT Support Intern',
        company: 'Universitas Negeri Makassar',
        period: 'Jan - Mar 2022',
        highlights: [
          'Instalasi software untuk lab kampus di gedung utama.',
          'Pemasangan dan konfigurasi jaringan.',
          'Pembuatan Dashboard Website Absensi mahasiswa.',
        ],
        stack: '-',
        images: [
          {
            image: pkl1,
          },
          {
            image: pkl,
          },
        ],
      },

      {
        role: 'Pengabdian Masyarakat',
        company: 'SMPN 58 Jakarta',
        period: '8 Mei 2025',
        highlights: [
          'Penyuluhan tentang pentingnya teknologi dalam pendidikan.',
          'Pengenalan konsep coding sederhana dengan dasar pemrograman.',
        ],
        stack: '-',
        images: [
          {
            image: pengabdian,
          },
          {
            image: pengabdian,
          },
        ],
      },

      {
        role: 'Studium Generale',
        company: 'Telkom University Jakarta',
        period: '28 Feb 2025',
        highlights: [
          'Kepanitiaan acara Studium Generale.',
          'Membantu koordinasi dengan pembicara dan peserta.',
          'Mendukung desain materi presentasi dan dokumentasi acara.',
        ],
        stack: '-',
        images: [
          {
            image: studium,
          },
          {
            image: studium1,
          },
        ],
      },
     
    ],
    [],
  )

  const organizations = useMemo(
    () => [
      {
        title: 'Anggota Divisi PDD',
        org: 'HMIT Telkom University Jakarta',
        detail: 'Bertanggung jawab dalam pengelolaan publikasi digital, pembuatan desain visual, serta dokumentasi kegiatan organisasi. Berperan dalam menjaga konsistensi identitas visual dan meningkatkan engagement media sosial himpunan.',
        image: Himpunan,
      },
      {
        title: 'Anggota',
        org: 'GDOC Telkom University Jakarta',
        detail: 'Berpartisipasi dalam pengembangan kolaborasi antar anggota untuk menciptakan solusi inovatif di bidang IT.',
        image: Devfest,
      },
    ],
    [],
  )

  // certificates removed per request

  return (
    <div className="page">
      {isAdminOpen && adminPanel === 'projects' && (
        <ProjectManager
          projects={projects}
          onAdd={handleAddProject}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
      {isAdminOpen && adminPanel === 'contacts' && (
        <ContactManager onClose={() => setIsAdminOpen(false)} />
      )}
      <div className="pm-fab-group">
        <button className="pm-fab pm-fab-contact" onClick={openContactAdmin} aria-label="Lihat Pesan & Kolaborator" title="Pesan & Kolaborator">
          ✉
        </button>
        <button className="pm-fab" onClick={openProjectAdmin} aria-label="Manage Projects" title="Manage Projects">
          &#9998;
        </button>
      </div>
      <header className="nav">
        <div className="container nav-inner">
          <div className="logo-mark">Adar Sarx</div>
          <nav className="nav-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#organization">Organization</a>
            <a href="#contact">Contact</a>
            <a href="#resume" className="button small">Resume</a>
          </nav>
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      <section className="hero pembuka">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">Information Technology Student</p>
            <h1>
              Hi, I’m <span>Adar Sarx Christian Firdaus Junior</span>
            </h1>
            <p className="subtitle">
              Web Developer | UI/UX
            </p>
            
            <div className="hero-actions">
              <a href="#projects" className="button primary">
                View Projects
              </a>

            </div>
            <div className="hero-socials">
              <a className="icon-pill" href="https://share.google/I7IkorQTDfK2SZuUr" target="_blank" rel="noopener noreferrer" title="LinkedIn">ln</a>
              <a className="icon-pill" href="https://medium.com/@adar.sarx" target="_blank" rel="noopener noreferrer" title="Medium">md</a>
              <a className="icon-pill" href="https://github.com/AdarSarx" target="_blank" rel="noopener noreferrer" title="GitHub">gh</a>
              <a className="icon-pill" href="https://www.instagram.com/adar_sarx?igsh=a2xhd2Npemc4emZ1&utm_source=qr" target="_blank" rel="noopener noreferrer" title="Instagram">ig</a>
            </div>
            <div className="badge-row">
              <span>Web Development</span>
              <span>UI/UX Design</span>
            </div>
          </div>
          {/* <div className="hero-card">
            <div className="hero-meta">
              <p className="description">
              Saya membangun produk digital, UI yang rapi,
              dan alur interaksi yang efisien. Fokus pada solusi modern berbasis
              data dan teknologi terkini.
            </p>
              <p className="hero-label">Campus</p>
              <p>Telkom University Jakarta</p>
              <p className="hero-label">Focus</p>
              <p>Web Developer • UI/UX</p>
            </div>  
          </div> */}
        </div>
        <div className="hero-blob" aria-hidden="true" />
      </section>

      <section id="about" className="section">
        <div className="container two-col">
          <div>
            <p className="section-kicker">About Me</p>
            <h2 className="section-title">
              <span>About</span> Me
            </h2>
            <p>
              Saya mahasiswa Teknologi Informasi yang fokus membangun aplikasi web
              modern dari riset kebutuhan, desain antarmuka, hingga implementasi dan
              optimasi. Saya menyukai tantangan untuk membuat produk yang cepat,
              aman, dan mudah digunakan.
            </p>
            <div className="info-grid">
              <div className="info-card">
                <p className="label">Education</p>
                <p>Telkom University Jakarta</p>
              </div>
              <div className="info-card">
                <p className="label">Major</p>
                <p>Information Technology</p>
              </div>
              <div className="info-card">
                <p className="label">Location</p>
                <p>Jakarta, Indonesia</p>
              </div>
              <div className="info-card">
                <p className="label">Status</p>
                <p>Undergraduate Student</p>
              </div>
            </div>
          </div>
          <div className="about-card">
            
            <img className="about-photo" src={adarImg} alt="Adar Sarx" />
            <h3>Adar Sarx Christian Firdaus Junior</h3>
            <p className="muted">
              Telkom University Jakarta • Information Technology
            </p>
            <div className="about-badges">
              <span>Web Dev</span>
              <span>UI/UX</span>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="section alt">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">Technical Skills</p>
            <h2 className="section-title">
              <span>Technical</span> Skills
            </h2>
            <p>Kompetensi teknis utama untuk membangun produk end-to-end.</p>
          </div>
          <div className="skill-grid">
            {skills.map((group) => (
              <div key={group.title} className="card">
                <div className="skill-head">
                  <span className="skill-icon">{group.icon}</span>
                  <h3>{group.title}</h3>
                </div>
                <div className="skill-list">
                  {group.items.map((item) => (
                    <div key={item.name} className="skill-item">
                      <div className="skill-row">
                        <span>{item.name}</span>
                        <span>{item.level}%</span>
                      </div>
                      <div className="progress">
                        <span style={{ width: `${item.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">Featured Projects</p>
            <h2 className="section-title">
              <span>Featured</span> Projects
            </h2>
            <p>Proyek kuliah dan pribadi yang menonjolkan aspek teknis dan impact.</p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article key={project.title} className="card project-card">
                {project.image ? (
                  <img className="project-thumb" src={project.image} alt={project.title + ' screenshot'} />
                ) : (
                  <div className={`project-thumb thumb-${index + 1}`} />
                )}
                <h3>{project.title}</h3>
                <span className="project-tag">{project.tag}</span>
                <p className="stack">{project.stack}</p>
                <p>{project.description}</p>
                <div className="project-actions">
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="section alt">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">internship experience & other activities</p>
            <h2 className="section-title">
              <span>Internship Experience</span> & other activities
            </h2>
            <p>Pengalaman magang dengan impact terukur dan fokus engineering.</p>
          </div>
          <div className="timeline">
            {experiences.map((exp) => (
              <div key={exp.role} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content card">
                  <div className="timeline-header">
                    <div>
                      <h3>{exp.role}</h3>
                      <p className="company">{exp.company}</p>
                    </div>
                    <span className="period">{exp.period}</span>
                  </div>
                  <ul>
                    {exp.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="experience-photos">
                    {exp.images && exp.images.map((img) => (
                      <figure key={img.image} className="photo-card">
                        <img src={img.image} alt={img.alt} loading="lazy" />
                      </figure>
                    ))}
                  </div>
                  <p className="stack">Tech stack: {exp.stack}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="organization" className="section">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">Organizations</p>
            <h2 className="section-title">
              <span>Organizations</span> & Leadership
            </h2>
            <p>Kontribusi organisasi kampus yang memperkuat leadership dan teamwork.</p>
          </div>
          <div className="org-grid">
            {organizations.map((org) => (
              <div key={org.title} className="card org-card">
                <figure className="org-photo">
                  <img src={org.image} alt="Organization documentation" loading="lazy" />
                </figure>
                <h3>{org.title}</h3>
                <p className="stack">{org.org}</p>
                <p>{org.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CollaboratorsSection />

      <ContactSection />

      {/* Certificates section removed per request */}
      <section id="resume" className="section alt">
        <div className="container two-col">
          <div>
            <p className="section-kicker">Resume</p>
            <h2 className="section-title"><span>Resume</span> & Download</h2>
            <p>Unduh CV saya untuk ringkasan pengalaman, pendidikan, dan skill.</p>
            <a href="/CV_Adar.pdf" className="button primary" download>Download CV</a>
          </div>
          <div className="muted">
            <p>Prefer contact? Email <a href="mailto:adar.sarx@mail.com">adar.sarx@mail.com</a></p>
            <div className="hero-socials">
              <a className="icon-pill" href="https://github.com/AdarSarx" target="_blank" rel="noopener noreferrer">gh</a>
              <a className="icon-pill" href="https://medium.com/@adar.sarx" target="_blank" rel="noopener noreferrer">md</a>
              <a className="icon-pill" href="https://www.instagram.com/adar_sarx" target="_blank" rel="noopener noreferrer">ig</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <p>© 2026 Adar Sarx Christian Firdaus Junior. All rights reserved.</p>
          <div className="footer-links">
            <a href="#projects">Projects</a>
            <a href="#resume">Resume</a>
            <a href="#about">About</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
