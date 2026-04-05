import React, { useRef, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const CATEGORY_COLORS = {
  Frontend: 'var(--yellow)',
  Backend: 'var(--red)',
  DevOps: 'var(--ink)',
  '3D': 'var(--yellow)',
  Tools: 'var(--ink)',
  Other: 'var(--red)',
  Animation: 'var(--yellow)',
  frontend: 'var(--yellow)',
  backend: 'var(--red)',
  tools: 'var(--ink)',
  'databases & infrastructure': 'var(--ink)'
}

function SkillCard({ skill, delay }) {
  const color = CATEGORY_COLORS[skill.category] || 'var(--yellow)'
  const numericLevel = Number(skill.level)
  const safeLevel = Number.isFinite(numericLevel) ? Math.max(0, Math.min(100, Math.round(numericLevel))) : 0
  return (
    <div
      className="skill-card"
      style={{
        backgroundColor: 'var(--bg)',
        border: 'var(--border)',
        boxShadow: 'var(--shadow)',
        padding: '1.25rem',
        transition: 'all 0.2s ease',
        opacity: 0,
        animation: `fadeUp 0.5s ease forwards ${delay}s`,
        cursor: 'default',
        willChange: 'transform',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: color === 'var(--ink)' ? 'var(--bg)' : 'var(--ink)',
            backgroundColor: color,
            padding: '0.15rem 0.4rem',
            border: 'var(--border)',
          }}
        >
          {skill.category}
        </span>
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '1rem',
          color: 'var(--ink)',
          marginBottom: '0.85rem',
        }}
      >
        {skill.name}
      </h3>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.4rem',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--light-muted)' }}>Proficiency</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--ink)' }}>{safeLevel}%</span>
        </div>
        <div
          style={{
            height: '8px',
            backgroundColor: 'rgba(10,10,10,0.08)',
            border: 'var(--border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              '--target-width': `${safeLevel}%`,
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '0%',
              backgroundColor: 'var(--ink)',
              animation: `growWidth 1s ease forwards ${delay + 0.3}s`,
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Skills() {
  const sectionRef = useRef(null)
  const [skills, setSkills] = useState([])

  useEffect(() => {
    supabase.from('skills').select('*').order('created_at', { ascending: true }).then(({ data }) => {
      if (data && data.length > 0) setSkills(data)
    })
  }, [])

  if (skills.length === 0) return null

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg)',
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
            — 02. Skills
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
            What I
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '2px var(--ink)',
                marginLeft: '0.3rem',
              }}
            >
              Work With
            </span>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {skills.map((skill, i) => (
            <SkillCard key={skill.id} skill={skill} delay={i * 0.06} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes growWidth {
          from { width: 0; }
          to { width: var(--target-width, 100%); }
        }
      `}</style>
    </section>
  )
}
