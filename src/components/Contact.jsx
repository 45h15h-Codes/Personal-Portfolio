import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Contact() {
  const [socialLinks, setSocialLinks] = useState([])
  const [email, setEmail] = useState('ashish@example.com')
  const [formData, setFormData] = useState({ name: '', mobile: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // 'idle', 'submitting', 'success', 'error'

  useEffect(() => {
    supabase.from('social_links').select('*').order('created_at', { ascending: true }).then(({ data }) => {
      if (data) setSocialLinks(data)
    })
    supabase.from('profile').select('email').single().then(({ data }) => {
      if (data && data.email) setEmail(data.email)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')

    const mobile = formData.mobile.trim()
    const messageBody = mobile
      ? `Mobile: ${mobile}\n\n${formData.message.trim()}`
      : formData.message.trim()
    
    const { error } = await supabase.from('contact_messages').insert([
      { 
        name: formData.name.trim(), 
        subject: formData.subject.trim(), 
        message: messageBody
      }
    ])

    if (error) {
      console.error(error)
      setStatus('error')
      // Revert to idle after 3s
      setTimeout(() => setStatus('idle'), 3000)
    } else {
      setStatus('success')
      setFormData({ name: '', mobile: '', subject: '', message: '' })
      // Keep success message visible for 5s
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '2px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'all 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    marginBottom: '0.4rem',
  }

  return (
    <section
      id="contact"
      style={{
        backgroundColor: 'var(--ink)',
        padding: '6rem 1.5rem 3rem',
        borderTop: 'var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '200px',
          height: '200px',
          backgroundColor: 'var(--red)',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          opacity: 0.6,
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            display: 'block',
            marginBottom: '1.25rem',
          }}
        >
          — 06. Contact
        </span>

        <div
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)',
            gap: '4rem',
            alignItems: 'start',
            marginBottom: '4rem',
          }}
        >
          {/* Left Column: Text & Socials */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ display: 'block', color: '#fff' }}>
                Let's Build
              </span>
              <span
                style={{
                  display: 'block',
                  color: 'transparent',
                  WebkitTextStroke: '2px #fff',
                }}
              >
                Something
              </span>
              <span style={{ display: 'block', color: 'var(--yellow)' }}>
                Great.
              </span>
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.90rem',
                color: 'rgba(255,255,255,0.55)',
                maxWidth: '480px',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              Open to freelance projects, full-time roles, and interesting collaborations.
              Send me an email directly, or drop a message via the secure form.
            </p>

            <a
              href={`mailto:${email}`}
              id="email-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'var(--yellow)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '1rem 2rem',
                border: '2px solid var(--bg)',
                boxShadow: '4px 4px 0 var(--bg)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                transition: 'all 0.2s ease',
                alignSelf: 'flex-start',
                marginBottom: '3rem'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)'
                e.currentTarget.style.boxShadow = '6px 6px 0 var(--bg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translate(0, 0)'
                e.currentTarget.style.boxShadow = '4px 4px 0 var(--bg)'
              }}
            >
              ✉ {email}
            </a>

            {/* Social Links Row */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '2px solid rgba(255,255,255,0.15)',
                    padding: '0.8rem 1.2rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                    e.currentTarget.style.transform = 'translate(-2px, -2px)'
                    e.currentTarget.style.boxShadow = '3px 3px 0 rgba(255,255,255,0.2)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                    e.currentTarget.style.transform = 'translate(0, 0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    {social.platform}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                    {social.handle || social.platform} ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Silent Form */}
          <div style={{ backgroundColor: '#fff', border: 'var(--border)', boxShadow: '8px 8px 0 rgba(0,0,0,0.3)', padding: '2.5rem', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: 'var(--ink)', marginBottom: '0.5rem', lineHeight: 1.1 }}>
              Secure Dispatch
            </h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '2rem' }}>
              Messages submitted here are routed directly to me.
            </p>

            {status === 'success' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--yellow)', border: 'var(--border)', padding: '2rem', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</span>
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Message Received!</h4>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink)' }}>I'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
                <div>
                  <label style={{...labelStyle, color: 'var(--ink)'}}>Your Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    style={{ ...inputStyle, backgroundColor: 'var(--bg)', borderColor: 'var(--ink)', color: 'var(--ink)', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.05)' }} 
                    required 
                    placeholder="John Doe"
                    disabled={status === 'submitting'}
                    onFocus={e => { e.currentTarget.style.boxShadow = '3px 3px 0 var(--ink)' }}
                    onBlur={e => { e.currentTarget.style.boxShadow = 'inset 2px 2px 0 rgba(0,0,0,0.05)' }}
                  />
                </div>

                <div>
                  <label style={{...labelStyle, color: 'var(--ink)'}}>Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={e => setFormData({...formData, mobile: e.target.value})}
                    style={{ ...inputStyle, backgroundColor: 'var(--bg)', borderColor: 'var(--ink)', color: 'var(--ink)', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.05)' }}
                    placeholder="+91 98765 43210"
                    disabled={status === 'submitting'}
                    onFocus={e => { e.currentTarget.style.boxShadow = '3px 3px 0 var(--ink)' }}
                    onBlur={e => { e.currentTarget.style.boxShadow = 'inset 2px 2px 0 rgba(0,0,0,0.05)' }}
                  />
                </div>
                
                <div>
                  <label style={{...labelStyle, color: 'var(--ink)'}}>Subject</label>
                  <input 
                    type="text" 
                    value={formData.subject} 
                    onChange={e => setFormData({...formData, subject: e.target.value})} 
                    style={{ ...inputStyle, backgroundColor: 'var(--bg)', borderColor: 'var(--ink)', color: 'var(--ink)', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.05)' }} 
                    required 
                    placeholder="Freelance Project"
                    disabled={status === 'submitting'}
                    onFocus={e => { e.currentTarget.style.boxShadow = '3px 3px 0 var(--ink)' }}
                    onBlur={e => { e.currentTarget.style.boxShadow = 'inset 2px 2px 0 rgba(0,0,0,0.05)' }}
                  />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{...labelStyle, color: 'var(--ink)'}}>Message</label>
                  <textarea 
                    value={formData.message} 
                    onChange={e => setFormData({...formData, message: e.target.value})} 
                    style={{ ...inputStyle, backgroundColor: 'var(--bg)', borderColor: 'var(--ink)', color: 'var(--ink)', resize: 'vertical', minHeight: '120px', flex: 1, boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.05)' }} 
                    required 
                    placeholder="Hey Ashish, I have an idea for a web app..."
                    disabled={status === 'submitting'}
                    onFocus={e => { e.currentTarget.style.boxShadow = '3px 3px 0 var(--ink)' }}
                    onBlur={e => { e.currentTarget.style.boxShadow = 'inset 2px 2px 0 rgba(0,0,0,0.05)' }}
                  />
                </div>

                {status === 'error' && (
                  <div style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>
                    Failed to send message. Please try again.
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={status === 'submitting'}
                  style={{
                    backgroundColor: 'var(--ink)',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    padding: '1rem',
                    border: 'var(--border)',
                    boxShadow: '4px 4px 0 var(--bg)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: status === 'submitting' ? 'wait' : 'pointer',
                    transition: 'all 0.2s ease',
                    marginTop: '0.5rem',
                    opacity: status === 'submitting' ? 0.7 : 1
                  }}
                  onMouseEnter={e => {
                    if (status !== 'submitting') {
                      e.currentTarget.style.transform = 'translate(-2px, -2px)'
                      e.currentTarget.style.boxShadow = '6px 6px 0 var(--bg)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (status !== 'submitting') {
                      e.currentTarget.style.transform = 'translate(0, 0)'
                      e.currentTarget.style.boxShadow = '4px 4px 0 var(--bg)'
                    }
                  }}
                >
                  {status === 'submitting' ? 'Transmitting...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div
          style={{
            borderTop: '2px solid rgba(255,255,255,0.1)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.05em',
            }}
          >
            © {new Date().getFullYear()} Ashish — Designed &amp; Built with ♥
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--red)', borderRadius: '50%', animation: 'pulse-dot 2s ease infinite' }} />
            Available for Work
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  )
}
