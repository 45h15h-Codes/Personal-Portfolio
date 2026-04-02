import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

function FloatingBadge({ text, style }) {
  return (
    <div
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        fontWeight: 700,
        color: 'var(--ink)',
        backgroundColor: 'var(--yellow)',
        border: 'var(--border)',
        boxShadow: 'var(--shadow)',
        padding: '0.3rem 0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        animation: 'float 4s ease-in-out infinite',
        ...style,
      }}
    >
      {text}
    </div>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const [profile, setProfile] = useState({
    headline: 'Full Stack Developer & Creative Engineer',
    tagline: 'Building Bold & Fast Experiences.',
    description: 'I craft developer-focused, high-performance web apps with clean architecture, sharp design, and zero compromises.',
    years_exp: '1+',
    projects_completed: '20+',
    clients: '10+'
  })

  useEffect(() => {
    supabase.from('profile').select('*').limit(1).single().then(({ data }) => {
      if (data) setProfile(data)
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll('.hero-animate')
            children.forEach((child, i) => {
              child.style.animationDelay = `${i * 0.12}s`
              child.style.animationPlayState = 'running'
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  // Split tagline for visual styling
  const taglineParts = profile.tagline.split(' ')
  const midPoint = Math.floor(taglineParts.length / 2)
  const firstHalf = taglineParts.slice(0, midPoint).join(' ')
  const secondHalf = taglineParts.slice(midPoint).join(' ') || 'Experiences.'

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '80px',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(10,10,10,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '12%',
          right: '8%',
          animation: 'float 5s ease-in-out infinite',
          animationDelay: '0.5s',
        }}
      >
        <FloatingBadge text="Open to Work ✓" style={{ backgroundColor: 'var(--yellow)' }} />
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '12%',
          animation: 'float 6s ease-in-out infinite',
          animationDelay: '1.2s',
        }}
      >
        <div style={{
          width: '80px',
          height: '80px',
          border: 'var(--border)',
          boxShadow: 'var(--shadow)',
          backgroundColor: 'var(--red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '1.5rem',
        }}>
          {'{}'}
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '30%',
          left: '3%',
          animation: 'float 7s ease-in-out infinite',
          animationDelay: '2s',
        }}
      >
        <div style={{
          width: '50px',
          height: '50px',
          border: 'var(--border)',
          boxShadow: 'var(--shadow)',
          backgroundColor: 'var(--yellow)',
        }} />
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4rem 1.5rem',
          width: '100%',
        }}
      >
        <div
          className="hero-animate"
          style={{
            opacity: 0,
            animation: 'fadeUp 0.6s ease forwards',
            animationPlayState: 'paused',
            marginBottom: '1.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--red)',
              border: '2px solid var(--ink)',
              animation: 'pulse-dot 2s ease infinite',
            }} />
            {profile.headline}
          </span>
        </div>

        <h1
          className="hero-animate"
          style={{
            opacity: 0,
            animation: 'fadeUp 0.6s ease forwards',
            animationPlayState: 'paused',
            fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
            fontWeight: 900,
            lineHeight: 1.0,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ display: 'block', color: 'var(--ink)' }}>
            {firstHalf}
          </span>
          <span
            style={{
              display: 'block',
              color: 'transparent',
              WebkitTextStroke: '3px var(--ink)',
              textStroke: '3px var(--ink)',
            }}
          >
            {secondHalf}
          </span>
        </h1>

        <p
          className="hero-animate"
          style={{
            opacity: 0,
            animation: 'fadeUp 0.6s ease forwards',
            animationPlayState: 'paused',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            color: 'var(--muted)',
            maxWidth: '480px',
            marginBottom: '2.5rem',
            lineHeight: 1.7,
          }}
        >
          {profile.description}
          <span style={{ display: 'inline-block', width: '2px', height: '1em', backgroundColor: 'var(--ink)', marginLeft: '2px', animation: 'blink 1s step-end infinite', verticalAlign: 'middle' }} />
        </p>

        <div
          className="hero-animate"
          style={{
            opacity: 0,
            animation: 'fadeUp 0.6s ease forwards',
            animationPlayState: 'paused',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '3rem',
          }}
        >
          <a
            href="mailto:ashish@example.com"
            id="hire-me-btn"
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--red)',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '0.85rem 1.75rem',
              border: 'var(--border)',
              boxShadow: 'var(--shadow)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
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
            ✉ Hire Me
          </a>

          <a
            href="#projects"
            id="view-work-btn"
            onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              color: 'var(--ink)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '0.85rem 1.75rem',
              border: 'var(--border)',
              boxShadow: 'var(--shadow)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
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
            → View Work
          </a>
        </div>

        <div
          className="hero-animate"
          style={{
            opacity: 0,
            animation: 'fadeUp 0.6s ease forwards',
            animationPlayState: 'paused',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          {[
            { num: profile.years_exp, label: 'Years Exp.' },
            { num: profile.projects_completed, label: 'Projects' },
            { num: profile.clients, label: 'Happy Clients' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.6rem', color: 'var(--ink)', lineHeight: 1.1 }}>
                {stat.num}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'float 2s ease-in-out infinite',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--light-muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Scroll</span>
        <div style={{ width: '2px', height: '40px', backgroundColor: 'var(--ink)', opacity: 0.3 }} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          #hero h1 { font-size: clamp(2.2rem, 12vw, 4rem) !important; }
        }
      `}</style>
    </section>
  )
}
