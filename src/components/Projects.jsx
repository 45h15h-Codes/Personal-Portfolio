import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProjectModal from './ProjectModal'

function Tag({ children, variant = 'default' }) {
  const styles = {
    default: {
      fontFamily: 'var(--font-mono)',
      fontSize: '0.6rem',
      fontWeight: 700,
      color: 'var(--ink)',
      border: 'var(--border)',
      padding: '0.15rem 0.45rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      backgroundColor: 'var(--bg)',
      display: 'inline-block',
    },
    inverted: {
      fontFamily: 'var(--font-mono)',
      fontSize: '0.6rem',
      fontWeight: 700,
      color: 'var(--ink)',
      border: '2px solid var(--bg)',
      padding: '0.15rem 0.45rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      backgroundColor: 'var(--bg)',
      display: 'inline-block',
    },
  }
  return <span style={styles[variant]}>{children}</span>
}

/* ============================================
   FEATURED HERO CARD — Horizontal layout
   ============================================ */
function FeaturedCard({ project, onClick }) {
  const year = new Date(project.created_at).getFullYear()

  return (
    <div
      id="featured-project"
      onClick={onClick}
      style={{
        backgroundColor: 'var(--ink)',
        border: 'var(--border)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        animation: 'fadeUp 0.6s ease forwards',
        opacity: 0,
        willChange: 'transform',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        marginBottom: '1.5rem',
        minHeight: '340px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translate(-3px, -3px)'
        e.currentTarget.style.boxShadow = '10px 10px 0px rgba(10,10,10,0.9)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translate(0, 0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
      }}
    >
      {/* Decorative Corner */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          backgroundColor: 'var(--red)',
          clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
          zIndex: 10,
        }}
      />

      {/* Thumbnail — Left */}
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#1a1a1a',
          borderRight: 'var(--border)',
          overflow: 'hidden',
        }}
      >
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.15,
            }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '8rem', fontWeight: 900, color: '#fff' }}>
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content — Right */}
      <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              fontWeight: 700,
              color: 'var(--ink)',
              backgroundColor: 'var(--yellow)',
              border: '2px solid var(--ink)',
              padding: '0.2rem 0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
            }}
          >
            ★ Featured
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
            {year}
          </span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            color: '#fff',
            lineHeight: 1.1,
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {project.tags?.slice(0, 5).map(tag => (
            <Tag key={tag} variant="inverted">{tag}</Tag>
          ))}
          {project.tags?.length > 5 && <Tag variant="inverted">+{project.tags.length - 5}</Tag>}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              onClick={e => e.stopPropagation()}
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.7rem',
                color: 'var(--ink)',
                backgroundColor: 'var(--yellow)',
                padding: '0.5rem 1rem',
                border: '2px solid var(--bg)',
                boxShadow: '3px 3px 0 var(--bg)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)'
                e.currentTarget.style.boxShadow = '5px 5px 0 var(--bg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translate(0, 0)'
                e.currentTarget.style.boxShadow = '3px 3px 0 var(--bg)'
              }}
            >
              GitHub →
            </a>
          )}
          {project.demo_link && (
            <a
              href={project.demo_link}
              target="_blank"
              onClick={e => e.stopPropagation()}
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.7rem',
                color: '#fff',
                backgroundColor: 'transparent',
                padding: '0.5rem 1rem',
                border: '2px solid rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
            >
              Demo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================
   ASYMMETRIC PROJECT CARD
   ============================================ */
function ProjectCard({ project, size = 'normal', delay = 0, onClick }) {
  const year = new Date(project.created_at).getFullYear()
  const isWide = size === 'wide'

  return (
    <div
      onClick={onClick}
      style={{
        gridColumn: isWide ? 'span 2' : 'span 1',
        backgroundColor: 'var(--bg)',
        border: 'var(--border)',
        boxShadow: 'var(--shadow)',
        position: 'relative',
        overflow: 'hidden',
        display: isWide ? 'grid' : 'flex',
        flexDirection: 'column',
        gridTemplateColumns: isWide ? '1.2fr 1fr' : undefined,
        opacity: 0,
        animation: `fadeUp 0.6s ease forwards ${delay}s`,
        willChange: 'transform',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translate(-3px, -3px)'
        e.currentTarget.style.boxShadow = '8px 8px 0px rgba(10,10,10,0.9)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translate(0, 0)'
        e.currentTarget.style.boxShadow = 'var(--shadow)'
      }}
    >
      {/* Decorative accent for wide cards */}
      {isWide && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-15px',
            right: '-15px',
            width: '60px',
            height: '60px',
            backgroundColor: 'var(--yellow)',
            transform: 'rotate(45deg)',
            zIndex: 0,
            opacity: 0.6,
          }}
        />
      )}

      {/* Thumbnail */}
      <div
        style={{
          width: '100%',
          height: isWide ? '100%' : '180px',
          minHeight: isWide ? '200px' : '150px',
          backgroundColor: 'var(--yellow)',
          borderBottom: !isWide ? 'var(--border)' : 'none',
          borderRight: isWide ? 'var(--border)' : 'none',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.15,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '4rem',
                fontWeight: 900,
                color: 'var(--ink)',
              }}
            >
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          flex: 1,
          position: 'relative',
          zIndex: 1,
          justifyContent: isWide ? 'center' : 'flex-start',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--light-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {year}
          </span>
          {(project.demo_link || project.github_link) && (
            <a
              href={project.demo_link || project.github_link}
              target="_blank"
              onClick={e => e.stopPropagation()}
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem',
                color: 'var(--ink)',
                transition: 'transform 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(2px, -2px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0, 0)' }}
            >
              ↗
            </a>
          )}
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: isWide ? '1.2rem' : '1rem',
            color: 'var(--ink)',
            lineHeight: 1.2,
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--muted)',
            lineHeight: 1.6,
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: isWide ? 4 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto' }}>
          {project.tags?.slice(0, isWide ? 5 : 4).map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {project.tags?.length > (isWide ? 5 : 4) && (
            <Tag>+{project.tags.length - (isWide ? 5 : 4)}</Tag>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================
   SIZE PATTERNS — no tall cards to avoid gaps
   ============================================ */
function getCardSize(index, total) {
  if (total === 1) return 'wide'
  if (total === 2) return index === 0 ? 'wide' : 'normal'

  // Pattern: wide, normal, normal — fills a 3-col grid perfectly
  // Every 3 items = one row with 1 wide + gap, then 2 normals
  // Alternate: normal, normal, wide for variety
  const row = Math.floor(index / 3)
  const posInRow = index % 3
  
  if (row % 2 === 0) {
    // Even rows: wide first, then 2 normals (but wide only fills 2 cols + 1 normal)
    // Actually: [wide(2col), normal(1col)] = 3 cols ✓ 
    // Then next needs to be [normal, normal, normal] or [normal, wide]
    return posInRow === 0 ? 'wide' : 'normal'
  } else {
    // Odd rows: normal first, then wide
    return posInRow === 2 ? 'wide' : 'normal'
  }
}

/* ============================================
   MAIN COMPONENT
   ============================================ */
export default function Projects() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    supabase.from('projects').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setProjects(data)
    })
  }, [])

  if (projects.length === 0) return null

  const featured = projects.find((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <section
      id="projects"
      style={{
        backgroundColor: 'var(--yellow)',
        padding: '6rem 1.5rem',
        borderTop: 'var(--border)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
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
            — 03. Projects
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
            Things I've
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '2px var(--ink)',
                marginLeft: '0.3rem',
              }}
            >
              Built
            </span>
          </h2>
        </div>

        {/* Featured Project — Horizontal hero card */}
        {featured && (
          <FeaturedCard
            project={featured}
            onClick={() => setSelectedProject(featured)}
          />
        )}

        {/* Asymmetric Grid for other projects */}
        {others.length > 0 && (
          <div
            className="asymmetric-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
            }}
          >
            {others.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                size={getCardSize(i, others.length)}
                delay={0.15 + i * 0.12}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          #featured-project {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          #featured-project > div:first-child {
            height: 220px !important;
            border-right: none !important;
            border-bottom: var(--border) !important;
          }
          .asymmetric-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .asymmetric-grid > div {
            grid-column: span 1 !important;
          }
        }
        @media (max-width: 600px) {
          .asymmetric-grid {
            grid-template-columns: 1fr !important;
          }
          .asymmetric-grid > div {
            min-height: 260px !important;
          }
        }
      `}</style>
    </section>
  )
}
