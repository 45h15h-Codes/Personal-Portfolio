import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect to admin if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin', { replace: true })
      }
    })
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    
    // Client-side validation
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)

    // Authenticate with Supabase
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Login mismatch:', authError.message)
      // Generic error message (Security best practice: don't reveal if user exists)
      setError('Invalid credentials or unauthorized access.')
      setLoading(false)
    } else {
      // Secure redirect
      const destination = location.state?.from?.pathname || '/admin'
      navigate(destination, { replace: true })
    }
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundImage: 'radial-gradient(circle, rgba(10,10,10,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#fff',
          border: 'var(--border)',
          boxShadow: 'var(--shadow-lg)',
          padding: '2.5rem',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '30px', height: '30px', backgroundColor: 'var(--red)', border: 'var(--border)' }} />
        
        <h1 
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: '2rem',
            color: 'var(--ink)',
            marginBottom: '0.5rem',
            lineHeight: 1.1
          }}
        >
          System
          <br/>
          <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--ink)' }}>
            Access
          </span>
        </h1>
        
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '2rem' }}>
          Restricted area. Identity verification required.
        </p>

        {error && (
          <div style={{ backgroundColor: '#fff', border: '2px solid var(--red)', borderLeft: '6px solid var(--red)', padding: '0.75rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label 
              htmlFor="email"
              style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '0.5rem' }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg)',
                border: 'var(--border)',
                padding: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                outline: 'none',
                boxShadow: 'inset 2px 2px 0 rgba(10,10,10,0.05)',
                opacity: loading ? 0.7 : 1
              }}
              onFocus={e => { e.currentTarget.style.boxShadow = '4px 4px 0 var(--ink)' }}
              onBlur={e => { e.currentTarget.style.boxShadow = 'inset 2px 2px 0 rgba(10,10,10,0.05)' }}
            />
          </div>

          <div>
            <label 
              htmlFor="password"
              style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '0.5rem' }}
            >
              Master Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg)',
                border: 'var(--border)',
                padding: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                outline: 'none',
                boxShadow: 'inset 2px 2px 0 rgba(10,10,10,0.05)',
                opacity: loading ? 0.7 : 1
              }}
              onFocus={e => { e.currentTarget.style.boxShadow = '4px 4px 0 var(--ink)' }}
              onBlur={e => { e.currentTarget.style.boxShadow = 'inset 2px 2px 0 rgba(10,10,10,0.05)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: 'var(--ink)',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '0.9rem',
              border: 'var(--border)',
              boxShadow: 'var(--shadow)',
              cursor: loading ? 'wait' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              transition: 'all 0.2s ease',
              marginTop: '0.5rem',
              opacity: loading ? 0.8 : 1
            }}
            onMouseEnter={e => {
              if(!loading) {
                e.currentTarget.style.transform = 'translate(-2px, -2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
              }
            }}
            onMouseLeave={e => {
              if(!loading) {
                e.currentTarget.style.transform = 'translate(0, 0)'
                e.currentTarget.style.boxShadow = 'var(--shadow)'
              }
            }}
          >
            {loading ? 'Authenticating...' : 'Authorize Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
