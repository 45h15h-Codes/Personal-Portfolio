import React from 'react'

const TICKER_ITEMS = [
  'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Three.js',
  'GSAP', 'Python', 'REST APIs', 'MongoDB', 'Prisma', 'Tailwind CSS',
  'Next.js', 'AWS', 'Redis', 'GraphQL',
]

export default function Marquee() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div
      aria-hidden="true"
      style={{
        backgroundColor: 'var(--ink)',
        borderTop: 'var(--border)',
        borderBottom: 'var(--border)',
        overflow: 'hidden',
        padding: '0.75rem 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '0',
          animation: 'marquee 25s linear infinite',
          width: 'max-content',
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: i % 4 === 0 ? 'var(--yellow)' : i % 4 === 2 ? 'var(--red)' : '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              padding: '0 2rem',
              flexShrink: 0,
            }}
          >
            {item}
            <span style={{ marginLeft: '2rem', color: 'rgba(255,255,255,0.2)' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
