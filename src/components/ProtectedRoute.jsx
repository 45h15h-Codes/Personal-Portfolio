import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error.message)
      }
      setAuthenticated(!!session)
      setLoading(false)
    })

    // Listen for auth changes (like logging out from another tab)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div 
        style={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: 'var(--bg)', 
          fontFamily: 'var(--font-mono)',
          color: 'var(--ink)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
           <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--ink)', animation: 'spin 1s linear infinite' }} />
           <span>Verifying Clearance...</span>
        </div>
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  if (!authenticated) {
    // Redirect to login but save the attempted location
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
