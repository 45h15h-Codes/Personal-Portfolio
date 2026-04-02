import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const navItems = [
    { name: 'Overview', path: '/admin', end: true },
    { name: 'Projects', path: '/admin/projects' },
    { name: 'Skills', path: '/admin/skills' },
    { name: 'Currently Building', path: '/admin/building' },
    { name: 'Inbox', path: '/admin/inbox' },
    { name: 'Guestbook', path: '/admin/guestbook' },
    { name: 'Profile & Social', path: '/admin/contact' }
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside 
        style={{ 
          width: '280px', 
          backgroundColor: 'var(--yellow)', 
          borderRight: 'var(--border)', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh'
        }}
      >
        <div style={{ padding: '2rem 1.5rem', borderBottom: 'var(--border)', backgroundColor: 'var(--ink)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: '#fff', margin: 0, lineHeight: 1 }}>
            Admin
            <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '1px #fff' }}>
              Panel
            </span>
          </h2>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              style={({ isActive }) => ({
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '0.85rem 1rem',
                border: 'var(--border)',
                backgroundColor: isActive ? 'var(--ink)' : 'var(--bg)',
                color: isActive ? '#fff' : 'var(--ink)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '4px 4px 0 rgba(10,10,10,0.8)' : '2px 2px 0 rgba(10,10,10,0.1)',
                transform: isActive ? 'translate(-2px, -2px)' : 'none',
              })}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: 'var(--border)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#fff',
              backgroundColor: 'var(--red)',
              border: 'var(--border)',
              padding: '0.75rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow)',
              transition: 'transform 0.1s, box-shadow 0.1s',
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
            Sign Out →
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
