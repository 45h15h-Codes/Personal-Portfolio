import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function ContactAdmin() {
  const [profile, setProfile] = useState({ id: '', email: '', tagline: '' })
  const [socials, setSocials] = useState([])
  
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')

  const [loadingSocial, setLoadingSocial] = useState(false)
  const [socialError, setSocialError] = useState('')
  const [deletingSocialId, setDeletingSocialId] = useState(null)

  const [socialForm, setSocialForm] = useState({
    platform: '',
    url: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [profileRes, socialsRes] = await Promise.all([
      supabase.from('profile').select('*').limit(1).single(),
      supabase.from('social_links').select('*').order('created_at', { ascending: false })
    ])

    if (profileRes.data) setProfile(profileRes.data)
    if (socialsRes.data) setSocials(socialsRes.data)
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')
    setLoadingProfile(true)

    if (!profile.email) {
      setProfileError('Email is required.')
      setLoadingProfile(false)
      return
    }

    const { error } = await supabase
      .from('profile')
      .update({ email: profile.email, tagline: profile.tagline })
      .eq('id', profile.id)

    if (error) {
      setProfileError('Failed to update profile: ' + error.message)
    } else {
      setProfileSuccess('Profile updated successfully.')
      setTimeout(() => setProfileSuccess(''), 3000)
    }

    setLoadingProfile(false)
  }

  const handleAddSocial = async (e) => {
    e.preventDefault()
    setSocialError('')

    if (!socialForm.platform || !socialForm.url) {
      setSocialError('Platform and URL are required.')
      return
    }

    if (!socialForm.url.startsWith('http')) {
      setSocialError('URL must start with http/https.')
      return
    }

    setLoadingSocial(true)

    const newSocial = {
      platform: socialForm.platform.trim(),
      url: socialForm.url.trim()
    }

    const { error } = await supabase.from('social_links').insert([newSocial])

    if (error) {
       setSocialError('Failed to add social link: ' + error.message)
    } else {
       setSocialForm({ platform: '', url: '' })
       // Refresh socials
       const { data } = await supabase.from('social_links').select('*').order('created_at', { ascending: false })
       if (data) setSocials(data)
    }

    setLoadingSocial(false)
  }

  const handleDeleteSocial = async (id) => {
    setDeletingSocialId(id)
    await supabase.from('social_links').delete().eq('id', id)
    // Refresh
    const { data } = await supabase.from('social_links').select('*').order('created_at', { ascending: false })
    if (data) setSocials(data)
    setDeletingSocialId(null)
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: 'var(--border)',
    backgroundColor: 'var(--bg)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.85rem',
    outline: 'none',
    boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.05)'
  }

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: '0.4rem',
    color: 'var(--ink)'
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Profile & Socials</h1>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '3rem', fontSize: '0.9rem' }}>
        Manage your contact email, hero tagline, and social media links.
      </p>

      {/* Profile Base Info */}
      <div style={{ backgroundColor: '#fff', border: 'var(--border)', boxShadow: 'var(--shadow-lg)', padding: '2rem', marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', margin: '0 0 1.5rem 0' }}>Core Profile Details</h2>
        
        {profileError && <div style={{ padding: '1rem', backgroundColor: '#fff', border: '2px solid var(--red)', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{profileError}</div>}
        {profileSuccess && <div style={{ padding: '1rem', backgroundColor: '#fff', border: '2px solid var(--ink)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '1.5rem', fontWeight: 700 }}>{profileSuccess}</div>}

        <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr)', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Primary Contact Email *</label>
            <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} style={inputStyle} disabled={loadingProfile || !profile.id} required />
          </div>

          <div>
            <label style={labelStyle}>Hero Tagline</label>
            <textarea value={profile.tagline || ''} onChange={e => setProfile({...profile, tagline: e.target.value})} style={{...inputStyle, resize: 'vertical', minHeight: '80px'}} disabled={loadingProfile || !profile.id} maxLength={150} />
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: '0.2rem', display: 'block' }}>Displayed in the Hero section (max 150 chars).</span>
          </div>

          <div>
            <button 
              type="submit" 
              disabled={loadingProfile || !profile.id}
              style={{
                backgroundColor: 'var(--ink)',
                color: '#fff',
                padding: '0.75rem 2rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'var(--border)',
                textTransform: 'uppercase',
                boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
                cursor: loadingProfile ? 'wait' : 'pointer',
                opacity: loadingProfile ? 0.7 : 1,
              }}
            >
              {loadingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Social Links Manager */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', borderBottom: 'var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        Social Connectivity
      </h2>

      <div style={{ backgroundColor: 'var(--bg)', border: 'var(--border)', padding: '2rem', marginBottom: '2rem' }}>
        {socialError && <div style={{ padding: '1rem', backgroundColor: '#fff', border: '2px solid var(--red)', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{socialError}</div>}
        
        <form onSubmit={handleAddSocial} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) minmax(200px, 2fr) auto', gap: '1rem', alignItems: 'end' }}>
          <div>
             <label style={labelStyle}>Platform</label>
             <input type="text" placeholder="e.g. Dribbble" value={socialForm.platform} onChange={e => setSocialForm({...socialForm, platform: e.target.value})} style={inputStyle} disabled={loadingSocial} required />
          </div>
          <div>
             <label style={labelStyle}>URL</label>
             <input type="url" placeholder="https://" value={socialForm.url} onChange={e => setSocialForm({...socialForm, url: e.target.value})} style={inputStyle} disabled={loadingSocial} required />
          </div>
          <div style={{ paddingBottom: '2px' }}>
            <button 
              type="submit" 
              disabled={loadingSocial}
              style={{
                backgroundColor: 'var(--yellow)',
                color: 'var(--ink)',
                padding: '0.75rem 1.5rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'var(--border)',
                boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
                cursor: loadingSocial ? 'wait' : 'pointer',
              }}
            >
              + Add
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {socials.map(s => (
          <div key={s.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem', 
            backgroundColor: '#fff', 
            border: 'var(--border)', 
            boxShadow: 'var(--shadow)',
            opacity: deletingSocialId === s.id ? 0.5 : 1
          }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: 'var(--ink)' }}>{s.platform}</div>
              <a href={s.url} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>
                {s.url}
              </a>
            </div>
            <button 
              onClick={() => handleDeleteSocial(s.id)}
              disabled={deletingSocialId === s.id}
              style={{ flexShrink: 0, marginLeft: '1rem', backgroundColor: 'var(--red)', color: '#fff', border: 'var(--border)', padding: '0.4rem 0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
              title="Delete Link"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
