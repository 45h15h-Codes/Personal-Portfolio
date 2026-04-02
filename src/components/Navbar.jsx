import React, { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Building', href: '#building' },
  { label: 'Guestbook', href: '#guestbook' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      id="navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'var(--bg)' : 'var(--bg)',
        borderBottom: scrolled ? 'var(--border)' : '2px solid transparent',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 2px 0 var(--ink)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleNavClick('#hero') }}
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--bg)',
            backgroundColor: 'var(--ink)',
            border: 'var(--border)',
            padding: '0.35rem 0.75rem',
            letterSpacing: '0.05em',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: 'var(--shadow)',
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
          &lt;Ashish /&gt;
        </a>

        {/* Desktop Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
          className="nav-desktop"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--ink)',
                padding: '0.4rem 0.75rem',
                border: '2px solid transparent',
                transition: 'all 0.2s ease',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = 'var(--border)'
                e.currentTarget.style.boxShadow = 'var(--shadow)'
                e.currentTarget.style.transform = 'translate(-2px, -2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = '2px solid transparent'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translate(0, 0)'
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="mailto:ashishvala2004@gmail.com"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#fff',
              backgroundColor: 'var(--red)',
              padding: '0.4rem 1rem',
              border: 'var(--border)',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.2s ease',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginLeft: '0.5rem',
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
            Hire Me
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            background: 'none',
            border: 'var(--border)',
            padding: '0.5rem',
            cursor: 'pointer',
            boxShadow: menuOpen ? 'var(--shadow)' : 'none',
          }}
          className="nav-mobile-btn"
        >
          <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: 'var(--ink)', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translate(4px,5px)' : 'none' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: 'var(--ink)', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: 'var(--ink)', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(4px,-5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg)',
            borderTop: 'var(--border)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--ink)',
                padding: '0.75rem',
                border: 'var(--border)',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
