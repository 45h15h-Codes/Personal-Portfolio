import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    guestbookUnapproved: 0,
    guestbookTotal: 0
  })

  useEffect(() => {
    async function loadStats() {
      // Run these simultaneously
      const [projData, skillsData, gbData] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('skills').select('id', { count: 'exact' }),
        supabase.from('guestbook').select('id, approved', { count: 'exact' })
      ])

      const totalGuestbook = gbData.data?.length || 0
      const unapproved = gbData.data?.filter(n => !n.approved).length || 0

      setStats({
        projects: projData.count || 0,
        skills: skillsData.count || 0,
        guestbookTotal: totalGuestbook,
        guestbookUnapproved: unapproved
      })
    }

    loadStats()
  }, [])

  const statCardProps = {
    style: {
      backgroundColor: 'var(--bg)',
      border: 'var(--border)',
      boxShadow: 'var(--shadow)',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      height: '100%',
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '3rem', color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>
          Command Center
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Overview of your portfolio's active data.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        
        {/* Pending Actions Alert */}
        {stats.guestbookUnapproved > 0 && (
          <div style={{ gridColumn: '1 / -1', backgroundColor: 'var(--red)', border: 'var(--border)', padding: '1.5rem', boxShadow: 'var(--shadow-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: '#fff', display: 'block' }}>Action Required</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>You have {stats.guestbookUnapproved} pending guestbook reactions.</span>
            </div>
            <Link to="/admin/guestbook" style={{ backgroundColor: 'var(--ink)', color: '#fff', padding: '0.5rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textDecoration: 'none', border: 'var(--border)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              Review Now
            </Link>
          </div>
        )}

        {/* Stat Cards */}
        <div {...statCardProps}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Total Projects
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '4rem', color: 'var(--ink)', lineHeight: 1 }}>
            {stats.projects}
          </span>
        </div>

        <div {...statCardProps}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Skills Matrix
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '4rem', color: 'var(--ink)', lineHeight: 1 }}>
            {stats.skills}
          </span>
        </div>

        <div {...statCardProps}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Total Reactions
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '4rem', color: 'var(--ink)', lineHeight: 1 }}>
            {stats.guestbookTotal}
          </span>
        </div>

      </div>
    </div>
  )
}
