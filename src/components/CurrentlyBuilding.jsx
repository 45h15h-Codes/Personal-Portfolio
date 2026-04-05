import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function BuildingCard({ item, delay }) {
  const isLive = item.is_live

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '1.5rem',
        alignItems: 'start',
        backgroundColor: 'var(--bg)',
        border: 'var(--border)',
        boxShadow: 'var(--shadow)',
        padding: '1.75rem',
        transition: 'all 0.2s ease',
        opacity: 0,
        animation: `fadeUp 0.6s ease forwards ${delay}s`,
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
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '1.15rem',
              color: 'var(--ink)',
              lineHeight: 1.2,
            }}
          >
            {item.title}
          </h3>
          {isLive && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: '#fff',
                backgroundColor: 'var(--red)',
                padding: '0.15rem 0.5rem',
                border: 'var(--border)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                flexShrink: 0,
              }}
            >
              <span style={{ width: '5px', height: '5px', backgroundColor: '#fff', borderRadius: '50%', animation: 'pulse-dot 1.5s ease infinite' }} />
              LIVE
            </span>
          )}
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          {item.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {/* Note: In our current schema we don't have tags array for building, but we can safely skip or add it later */}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--light-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Progress</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--ink)' }}>{item.progress}%</span>
          </div>
          <div
            style={{
              height: '10px',
              backgroundColor: 'rgba(10,10,10,0.08)',
              border: 'var(--border)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${item.progress}%`,
                backgroundColor: item.progress > 50 ? 'var(--ink)' : 'var(--red)',
                '--target-width': `${item.progress}%`,
                animation: `growWidth 1.2s ease forwards ${delay + 0.3}s`,
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          width: '64px',
          height: '64px',
          border: 'var(--border)',
          boxShadow: 'var(--shadow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: item.progress > 50 ? 'var(--ink)' : 'var(--bg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              fontSize: '1.25rem',
              color: item.progress > 50 ? '#fff' : 'var(--ink)',
              lineHeight: 1,
            }}
          >
            {item.progress}
          </span>
          <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.75rem', 
              fontWeight: 900,
              color: item.progress > 50 ? 'rgba(255,255,255,0.6)' : 'var(--light-muted)', 
              marginLeft: '2px'
            }}>
            %
          </span>
        </div>
      </div>
    </div>
  )
}

export default function CurrentlyBuilding() {
  const [building, setBuilding] = useState([])

  useEffect(() => {
    supabase.from('building').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setBuilding(data)
    })
  }, [])

  if (building.length === 0) return null

  return (
    <section
      id="building"
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
            — 04. Currently Building
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
            Active
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '2px var(--ink)',
                marginLeft: '0.3rem',
              }}
            >
              Builds
            </span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {building.map((item, i) => (
            <BuildingCard key={item.id} item={item} delay={i * 0.15} />
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
