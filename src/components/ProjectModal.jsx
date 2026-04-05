import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

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

export default function ProjectModal({ project, onClose }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useLayoutEffect(() => {
    if (!project) return;

    // Esc key handling
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);

    // Entrance animations
    gsap.fromTo(overlayRef.current, 
      { backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)', opacity: 0 },
      { backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.5)', opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
    
    gsap.fromTo(modalRef.current,
      { y: 50, opacity: 0, rotateX: 5, perspective: 1000 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.5, ease: 'back.out(1.1)', delay: 0.1 }
    );
    
    // Prevent scrolling on background
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [project]);

  const handleClose = () => {
    gsap.to(overlayRef.current, { backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)', duration: 0.3 });
    gsap.to(modalRef.current, { y: 20, opacity: 0, duration: 0.3, onComplete: onClose });
  };

  if (!project) return null;

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
        padding: 'clamp(1rem, 5vw, 3rem)',
        opacity: 0, // initially hide until GSAP
      }}
      onClick={handleClose}
    >
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg)',
          border: 'var(--border)',
          boxShadow: '16px 16px 0 rgba(0,0,0,0.8)',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          willChange: 'transform, opacity',
          opacity: 0, // initially hide until GSAP
          transform: 'translateY(50px)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
            background: 'var(--red)',
            color: '#fff',
            border: 'var(--border)',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontWeight: 900,
            fontSize: '1.2rem',
            boxShadow: '4px 4px 0 var(--ink)',
            transition: 'transform 0.1s',
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(2px, 2px)'; e.currentTarget.style.boxShadow = '2px 2px 0 var(--ink)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--ink)'; }}
        >
          ✕
        </button>

        {/* Header / Thumbnail Area */}
        <div style={{
          width: '100%',
          height: 'clamp(150px, 25vh, 250px)',
          backgroundColor: 'var(--yellow)',
          borderBottom: 'var(--border)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {project.thumbnail ? (
            <img 
              src={project.thumbnail} 
              alt={project.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
             <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--ink)' }}>
               {project.title}
             </h2>
          )}
        </div>

        {/* Content Area */}
        <div style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
             <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>
               {project.title}
             </h2>
             <div style={{ display: 'flex', gap: '0.5rem' }}>
                {project.github_link && (
                  <a href={project.github_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, backgroundColor: 'var(--ink)', color: '#fff', padding: '0.3rem 0.8rem', border: 'var(--border)' }}>CODE</a>
                )}
                {project.demo_link && (
                  <a href={project.demo_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, backgroundColor: 'var(--yellow)', color: 'var(--ink)', padding: '0.3rem 0.8rem', border: 'var(--border)' }}>DEMO</a>
                )}
             </div>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            {project.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
          </div>

          <p style={{ fontFamily: 'inherit', fontSize: '1rem', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
            {project.detailed_description || project.description}
          </p>

          {/* Gallery Area */}
          {project.images && project.images.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--ink)', paddingBottom: '0.5rem', display: 'inline-block' }}>
                Gallery
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {project.images.map((img, idx) => (
                  <div key={idx} style={{ border: 'var(--border)', boxShadow: '6px 6px 0 rgba(0,0,0,0.8)', overflow: 'hidden', backgroundColor: 'var(--bg)', aspectRatio: '4/3' }}>
                    <img src={img} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
