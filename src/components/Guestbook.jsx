import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const NOTE_COLORS = [
  { bg: 'var(--yellow)', dark: false, label: 'Yellow' },
  { bg: 'var(--bg)', dark: false, label: 'White' },
  { bg: 'var(--red)', dark: true, label: 'Red' },
  { bg: 'var(--ink)', dark: true, label: 'Dark' },
]

function GuestNote({ note, index }) {
  const rotate = note.rotate || (['-2deg', '1.5deg', '-1deg', '2deg', '-1.5deg', '1deg'][index % 6])
  return (
    <div
      style={{
        backgroundColor: note.color,
        border: 'var(--border)',
        boxShadow: 'var(--shadow)',
        padding: '1.25rem',
        transform: `rotate(${rotate})`,
        transition: 'all 0.2s ease',
        opacity: 0,
        animation: `fadeUp 0.5s ease forwards ${index * 0.1}s`,
        willChange: 'transform',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'rotate(0deg) translate(-2px, -4px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
        e.currentTarget.style.zIndex = 10
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = `rotate(${rotate})`
        e.currentTarget.style.boxShadow = 'var(--shadow)'
        e.currentTarget.style.zIndex = 1
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          fontWeight: 700,
          color: note.dark ? 'rgba(255,255,255,0.6)' : 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          backgroundColor: note.dark ? 'rgba(255,255,255,0.1)' : 'rgba(10,10,10,0.05)',
          padding: '0.15rem 0.4rem',
          border: note.dark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(10,10,10,0.1)',
          width: 'fit-content',
        }}
      >
        ★ {note.project || 'General'}
      </span>

      <p
        style={{
          fontSize: '0.875rem',
          color: note.dark ? 'rgba(255,255,255,0.85)' : 'var(--ink)',
          lineHeight: 1.6,
          marginBottom: '0.25rem',
          fontStyle: 'italic',
        }}
      >
        "{note.message}"
      </p>
      
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: note.dark ? 'rgba(255,255,255,0.5)' : 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        — {note.name}
      </span>
    </div>
  )
}

export default function Guestbook() {
  const [notes, setNotes] = useState([])
  const [projectOptions, setProjectOptions] = useState(['General Portfolio'])
  const [formData, setFormData] = useState({ name: '', project: 'General Portfolio', message: '' })
  const [filter, setFilter] = useState('All')
  const [statusMsg, setStatusMsg] = useState('')
  const [selectedColor, setSelectedColor] = useState(0)
  const charLimit = 280

  useEffect(() => {
    // Fetch unique active projects for options
    supabase.from('projects').select('title').then(({ data }) => {
      if (data) {
        setProjectOptions(['General Portfolio', ...data.map(p => p.title)])
      }
    })

    // Fetch approved notes
    supabase.from('guestbook')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setNotes(data)
      })
  }, [])

  const filteredNotes = filter === 'All' 
    ? notes 
    : notes.filter(n => n.project === filter || (filter === 'General Portfolio' && !n.project))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.message.trim()) return

    // Soft rate limiting (1 minute)
    const lastPost = localStorage.getItem('last_post_time')
    if (lastPost && Date.now() - parseInt(lastPost) < 60000) {
      alert("Please wait a minute before posting another reaction.")
      return
    }

    setStatusMsg('Submitting...')

    const newNote = {
      name: formData.name.trim(),
      project: formData.project,
      message: formData.message.trim(),
      color: NOTE_COLORS[selectedColor].bg,
      dark: NOTE_COLORS[selectedColor].dark,
      rotate: ['-2deg', '1.5deg', '-1deg', '2deg'][Math.floor(Math.random() * 4)],
      approved: false // Needs admin approval to show up
    }

    const { error } = await supabase.from('guestbook').insert([newNote])

    if (error) {
      console.error(error)
      setStatusMsg('Error submitting reaction. Please try again.')
    } else {
      localStorage.setItem('last_post_time', Date.now().toString())
      setFormData({ name: '', project: projectOptions[0], message: '' })
      setStatusMsg('✓ Reaction sent! Waiting for approval.')
      setTimeout(() => setStatusMsg(''), 5000)
    }
  }

  const inputStyle = {
    width: '100%',
    backgroundColor: 'var(--bg)',
    border: 'var(--border)',
    padding: '0.75rem 1rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    color: 'var(--ink)',
    outline: 'none',
    boxShadow: 'inset 2px 2px 0 rgba(10,10,10,0.05)',
    transition: 'all 0.2s ease',
  }

  return (
    <section
      id="guestbook"
      style={{
        backgroundColor: 'var(--yellow)',
        padding: '6rem 1.5rem',
        borderTop: 'var(--border)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              display: 'block',
              marginBottom: '0.75rem',
            }}
          >
            — 05. Guestbook
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--ink)',
              lineHeight: 1.1,
            }}
          >
            Leave a
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '2px var(--ink)',
                marginLeft: '0.3rem',
              }}
            >
              Reaction
            </span>
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
            Seen my projects? Drop a targeted note below. Note: Spam is filtered.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 400px) 1fr',
            gap: '3rem',
            alignItems: 'start',
          }}
          className="guestbook-grid"
        >
          <form
            id="guestbook-form"
            onSubmit={handleSubmit}
            style={{
              backgroundColor: 'var(--bg)',
              border: 'var(--border)',
              boxShadow: 'var(--shadow-lg)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div>
              <label
                htmlFor="guest-name"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem',
                }}
              >
                Your Name
              </label>
              <input
                id="guest-name"
                type="text"
                placeholder="Anonymous Dev"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                maxLength={50}
                required
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.boxShadow = '4px 4px 0 var(--ink)' }}
                onBlur={e => { e.currentTarget.style.boxShadow = 'inset 2px 2px 0 rgba(10,10,10,0.05)' }}
              />
            </div>

            <div>
              <label
                htmlFor="guest-project"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem',
                }}
              >
                Regarding
              </label>
              <select
                id="guest-project"
                value={formData.project}
                onChange={(e) => setFormData((p) => ({ ...p, project: e.target.value }))}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'black\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                  cursor: 'pointer',
                }}
              >
                {projectOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label
                htmlFor="guest-message"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem',
                }}
              >
                Message ({charLimit - formData.message.length} left)
              </label>
              <textarea
                id="guest-message"
                placeholder="What did you think of the code/UX?"
                value={formData.message}
                onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value.slice(0, charLimit) }))}
                maxLength={charLimit}
                rows={4}
                required
                style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                onFocus={e => { e.currentTarget.style.boxShadow = '4px 4px 0 var(--ink)' }}
                onBlur={e => { e.currentTarget.style.boxShadow = 'inset 2px 2px 0 rgba(10,10,10,0.05)' }}
              />
            </div>

            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem',
                }}
              >
                Note Color
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {NOTE_COLORS.map((c, i) => (
                  <button
                    key={c.label}
                    type="button"
                    id={`color-btn-${c.label.toLowerCase()}`}
                    onClick={() => setSelectedColor(i)}
                    title={c.label}
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: c.bg,
                      border: selectedColor === i ? '3px solid var(--ink)' : '2px solid var(--ink)',
                      boxShadow: selectedColor === i ? 'var(--shadow)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              id="submit-note-btn"
              type="submit"
              style={{
                backgroundColor: 'var(--ink)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.85rem',
                padding: '0.9rem',
                border: 'var(--border)',
                boxShadow: 'var(--shadow)',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translate(0, 0)'
                e.currentTarget.style.boxShadow = 'var(--shadow)'
              }}
            >
              → Pin Reaction
            </button>
            {statusMsg && (
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: statusMsg.includes('Error') ? 'var(--red)' : 'var(--ink)',
                fontWeight: 700,
                textAlign: 'center',
                margin: 0
              }}>
                {statusMsg}
              </p>
            )}
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {projectOptions.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['All', ...projectOptions].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      backgroundColor: filter === opt ? 'var(--ink)' : 'var(--bg)',
                      color: filter === opt ? 'var(--bg)' : 'var(--ink)',
                      border: 'var(--border)',
                      padding: '0.25rem 0.6rem',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease',
                      boxShadow: filter === opt ? 'none' : '2px 2px 0 var(--ink)',
                      transform: filter === opt ? 'translate(2px, 2px)' : 'none',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.25rem',
                alignItems: 'start',
              }}
            >
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note, i) => (
                  <GuestNote key={note.id} note={note} index={i} />
                ))
              ) : (
                <div style={{ 
                  gridColumn: '1 / -1', 
                  padding: '3rem', 
                  border: '2px dashed var(--ink)', 
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--muted)'
                }}>
                  No reactions to show. Add one or wait for admin approval!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .guestbook-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
