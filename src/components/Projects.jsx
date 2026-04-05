import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProjectModal from './ProjectModal'

function Tag({ children }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        fontWeight: 700,
        color: 'var(--ink)',
        border: 'var(--border)',
        padding: '0.2rem 0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: 'var(--bg)',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  )
}

function FeaturedProject({ project, onClick }) {
  const year = new Date(project.created_at).getFullYear()
  return (
    <div
      id="featured-project"
      onClick={onClick}
      style={{
        backgroundColor: 'var(--ink)',
        border: 'var(--border)',
        boxShadow: 'var(--shadow-lg)',
        padding: '0',
        marginBottom: '1.5rem',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeUp 0.6s ease forwards',
        opacity: 0,
        willChange: 'transform',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translate(-3px, -3px)'
        e.currentTarget.style.boxShadow = '9px 9px 0px rgba(10,10,10,0.8)'
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
          width: '120px',
          height: '120px',
          backgroundColor: 'var(--red)',
          clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
          zIndex: 10
        }}
      />

      {/* Thumbnail Area */}
      {project.thumbnail && (
        <div style={{ width: '100%', height: 'clamp(200px, 30vw, 280px)', backgroundColor: 'var(--bg)', borderBottom: 'var(--border)' }}>
          <img src={project.thumbnail} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Content Area */}
      <div style={{ position: 'relative', padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--ink)',
              backgroundColor: 'var(--yellow)',
              border: '2px solid var(--bg)',
              padding: '0.2rem 0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            ★ Featured Project
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
            {year}
          </span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            color: '#fff',
            marginBottom: '1rem',
            lineHeight: 1.1,
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '0.95rem',
            maxWidth: '600px',
            marginBottom: '1.5rem',
            lineHeight: 1.7,
          }}
        >
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          {project.tags?.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'var(--ink)',
                border: '2px solid var(--bg)',
                padding: '0.2rem 0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                backgroundColor: 'var(--bg)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              onClick={e => e.stopPropagation()}
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: 'var(--ink)',
                backgroundColor: 'var(--yellow)',
                padding: '0.65rem 1.25rem',
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
              View on GitHub →
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
                fontSize: '0.8rem',
                color: '#fff',
                backgroundColor: 'transparent',
                padding: '0.65rem 1.25rem',
                border: '2px solid rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#fff'
                e.currentTarget.style.transform = 'translate(-2px, -2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                e.currentTarget.style.transform = 'translate(0, 0)'
              }}
            >
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function SmallProject({ project, delay, onClick }) {
  const year = new Date(project.created_at).getFullYear()
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg)',
        border: 'var(--border)',
        boxShadow: 'var(--shadow)',
        padding: '0',
        transition: 'all 0.2s ease',
        opacity: 0,
        animation: `fadeUp 0.6s ease forwards ${delay}s`,
        display: 'flex',
        flexDirection: 'column',
        willChange: 'transform',
        cursor: 'pointer'
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
      {/* Thumbnail */}
      <div style={{ width: '100%', height: '180px', backgroundColor: 'var(--yellow)', borderBottom: 'var(--border)', overflow: 'hidden' }}>
        {project.thumbnail ? (
           <img src={project.thumbnail} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900, color: 'var(--ink)' }}>{project.title.charAt(0)}</span>
           </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
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
          fontSize: '1.1rem',
          color: 'var(--ink)',
          lineHeight: 1.2,
        }}
      >
        {project.title}
      </h3>

      <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6, flex: 1 }}>
        {project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
        {project.tags?.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      </div>
    </div>
  )
}

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
  const small = projects.filter((p) => !p.featured)

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

        {featured && <FeaturedProject project={featured} onClick={() => setSelectedProject(featured)} />}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {small.map((project, i) => (
            <SmallProject key={project.id} project={project} delay={0.2 + i * 0.15} onClick={() => setSelectedProject(project)} />
          ))}
        </div>
      </div>

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  )
}
