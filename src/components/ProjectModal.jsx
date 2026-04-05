import React, { useLayoutEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

function Tag({ children }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
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

/* ============================================
   SIMPLE MARKDOWN RENDERER
   Handles: # headings, **bold**, *italic*,
   `code`, - lists, \n paragraphs
   ============================================ */
function renderMarkdown(text) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  let listItems = []
  let key = 0

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key++}`} style={{ margin: '0.75rem 0', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {listItems.map((item, i) => (
            <li key={i} style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--ink)' }}>
              {formatInline(item)}
            </li>
          ))}
        </ul>
      )
      listItems = []
    }
  }

  const formatInline = (str) => {
    // Process inline formatting: **bold**, *italic*, `code`
    const parts = []
    let remaining = str
    let partKey = 0

    while (remaining.length > 0) {
      // Bold **text**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
      // Italic *text*
      const italicMatch = remaining.match(/(?<!\*)\*([^*]+?)\*(?!\*)/)
      // Inline code `text`
      const codeMatch = remaining.match(/`(.+?)`/)

      // Find the earliest match
      const matches = [
        boldMatch && { type: 'bold', match: boldMatch },
        italicMatch && { type: 'italic', match: italicMatch },
        codeMatch && { type: 'code', match: codeMatch },
      ].filter(Boolean).sort((a, b) => a.match.index - b.match.index)

      if (matches.length === 0) {
        parts.push(remaining)
        break
      }

      const first = matches[0]
      const before = remaining.slice(0, first.match.index)
      if (before) parts.push(before)

      if (first.type === 'bold') {
        parts.push(<strong key={partKey++} style={{ fontWeight: 800 }}>{first.match[1]}</strong>)
      } else if (first.type === 'italic') {
        parts.push(<em key={partKey++}>{first.match[1]}</em>)
      } else if (first.type === 'code') {
        parts.push(
          <code key={partKey++} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85em',
            backgroundColor: 'rgba(10,10,10,0.08)',
            padding: '0.15rem 0.4rem',
            border: '1px solid rgba(10,10,10,0.15)',
            fontWeight: 600,
          }}>
            {first.match[1]}
          </code>
        )
      }

      remaining = remaining.slice(first.match.index + first.match[0].length)
    }

    return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Empty line
    if (line === '') {
      flushList()
      continue
    }

    // Headings
    if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h5 key={key++} style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1rem',
          color: 'var(--ink)',
          marginTop: '1.5rem',
          marginBottom: '0.5rem',
        }}>
          {formatInline(line.slice(4))}
        </h5>
      )
    } else if (line.startsWith('## ')) {
      flushList()
      elements.push(
        <h4 key={key++} style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '1.15rem',
          color: 'var(--ink)',
          marginTop: '2rem',
          marginBottom: '0.75rem',
          paddingBottom: '0.4rem',
          borderBottom: '2px solid var(--ink)',
          display: 'inline-block',
        }}>
          {formatInline(line.slice(3))}
        </h4>
      )
    } else if (line.startsWith('# ')) {
      flushList()
      // Skip top-level heading if it matches the project title
      elements.push(
        <h3 key={key++} style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '1.35rem',
          color: 'var(--ink)',
          marginTop: '2rem',
          marginBottom: '0.75rem',
        }}>
          {formatInline(line.slice(2))}
        </h3>
      )
    }
    // List items
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(line.slice(2))
    }
    // Regular paragraph
    else {
      flushList()
      elements.push(
        <p key={key++} style={{
          fontSize: '0.95rem',
          lineHeight: 1.8,
          color: 'var(--ink)',
          marginBottom: '0.75rem',
        }}>
          {formatInline(line)}
        </p>
      )
    }
  }

  flushList()
  return elements
}

export default function ProjectModal({ project, onClose }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  const description = useMemo(() => {
    if (!project) return null
    return renderMarkdown(project.detailed_description || project.description)
  }, [project])

  useLayoutEffect(() => {
    if (!project) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);

    gsap.fromTo(overlayRef.current,
      { backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)', opacity: 0 },
      { backdropFilter: 'blur(14px)', backgroundColor: 'rgba(0,0,0,0.55)', opacity: 1, duration: 0.4, ease: 'power2.out' }
    );

    gsap.fromTo(modalRef.current,
      { y: 60, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.2)', delay: 0.1 }
    );

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [project]);

  const handleClose = () => {
    gsap.to(overlayRef.current, { backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)', opacity: 0, duration: 0.3 });
    gsap.to(modalRef.current, { y: 30, opacity: 0, scale: 0.97, duration: 0.3, onComplete: onClose });
  };

  if (!project) return null;

  const year = new Date(project.created_at).getFullYear()

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 3vw, 2rem)',
        opacity: 0,
      }}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1050px',
          maxHeight: '92vh',
          backgroundColor: 'var(--bg)',
          border: '3px solid var(--ink)',
          boxShadow: '12px 12px 0 var(--ink)',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          willChange: 'transform, opacity',
          opacity: 0,
          transform: 'translateY(60px)',
        }}
      >
        {/* ============================================
            HERO HEADER — Matches the asymmetric card
            ============================================ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: project.thumbnail ? '1.1fr 1fr' : '1fr',
          minHeight: 'clamp(240px, 35vh, 340px)',
          backgroundColor: 'var(--ink)',
          borderBottom: '3px solid var(--ink)',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {/* Decorative Corner Triangle — matching card */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '90px',
              height: '90px',
              backgroundColor: 'var(--red)',
              clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
              zIndex: 10,
            }}
          />

          {/* Close Button — positioned over the corner */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              zIndex: 20,
              background: 'transparent',
              color: '#fff',
              border: 'none',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              fontSize: '1.1rem',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            ✕
          </button>

          {/* Thumbnail — Left */}
          {project.thumbnail && (
            <div style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              borderRight: '3px solid var(--ink)',
            }}>
              <img
                src={project.thumbnail}
                alt={project.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          )}

          {/* Content — Right side of header */}
          <div style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '0.85rem',
            position: 'relative',
          }}>
            {/* Featured badge + Year — matching card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {project.featured && (
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
              )}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.4)',
              }}>
                {year}
              </span>
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(1.4rem, 2.8vw, 2rem)',
                color: '#fff',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {project.title}
            </h2>

            {/* Short description in header */}
            <p style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.85rem',
              lineHeight: 1.65,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              margin: 0,
            }}>
              {project.description}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {project.tags?.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    color: 'var(--ink)',
                    border: '2px solid var(--bg)',
                    padding: '0.15rem 0.45rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: 'var(--bg)',
                    display: 'inline-block',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons — matching card style */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              {project.github_link && (
                <a
                  href={project.github_link}
                  target="_blank"
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
                    textDecoration: 'none',
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
                    textDecoration: 'none',
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

        {/* ============================================
            BODY CONTENT
            ============================================ */}
        <div style={{
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          flex: 1,
        }}>
          {/* Detailed Description — rendered as formatted markdown */}
          {project.detailed_description && (
            <div style={{ marginBottom: '2.5rem' }}>
              {description}
            </div>
          )}

          {/* Gallery Area */}
          {project.images && project.images.length > 0 && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1.35rem',
                  color: 'var(--ink)',
                  margin: 0,
                }}>
                  Gallery
                </h3>
                <div style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: 'var(--ink)',
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'var(--light-muted)',
                  textTransform: 'uppercase',
                }}>
                  {project.images.length} {project.images.length === 1 ? 'image' : 'images'}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: project.images.length === 1
                  ? '1fr'
                  : project.images.length === 2
                    ? 'repeat(2, 1fr)'
                    : 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.25rem',
              }}>
                {project.images.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: 'var(--border)',
                      boxShadow: 'var(--shadow)',
                      overflow: 'hidden',
                      backgroundColor: 'var(--bg)',
                      aspectRatio: '16/10',
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
                    <img
                      src={img}
                      alt={`${project.title} - Screenshot ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          div[ref] > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
