import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function BuildingAdmin() {
  const [builds, setBuilds] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    progress: 50,
    is_live: false
  })
  
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchBuilds()
  }, [])

  const fetchBuilds = async () => {
    const { data } = await supabase.from('building').select('*').order('created_at', { ascending: false })
    if (data) setBuilds(data)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Title and Description are required.')
      return
    }

    setLoading(true)

    const newBuild = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      progress: parseInt(formData.progress, 10),
      is_live: formData.is_live
    }

    const { error } = await supabase.from('building').insert([newBuild])

    if (error) {
      setFormError('Failed to log update: ' + error.message)
    } else {
      setFormData({ title: '', description: '', progress: 50, is_live: false })
      await fetchBuilds()
    }

    setLoading(false)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    await supabase.from('building').delete().eq('id', id)
    await fetchBuilds()
    setDeletingId(null)
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
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Currently Building</h1>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '3rem', fontSize: '0.9rem' }}>
        Share updates on your current works in progress.
      </p>

      {/* Add Form */}
      <div style={{ backgroundColor: 'var(--bg)', backgroundImage: 'radial-gradient(circle, rgba(10,10,10,0.05) 1px, transparent 1px)', backgroundSize: '10px 10px', border: 'var(--border)', boxShadow: 'var(--shadow-lg)', padding: '2rem', marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', margin: '0 0 1.5rem 0' }}>Log Progress</h2>
        
        {formError && (
          <div style={{ padding: '1rem', backgroundColor: '#fff', border: '2px solid var(--red)', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) minmax(100px, 1fr) minmax(150px, 1fr)', gap: '1.5rem', alignItems: 'end' }}>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Project/Update Title *</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={inputStyle} disabled={loading} required maxLength={100} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Description *</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, resize: 'vertical', minHeight: '80px'}} disabled={loading} required maxLength={300} />
          </div>

          <div>
            <label style={{...labelStyle, marginBottom: '0.8rem'}}>Progress: {formData.progress}%</label>
            <input type="range" min="0" max="100" value={formData.progress} onChange={e => setFormData({...formData, progress: e.target.value})} style={{ width: '100%', accentColor: 'var(--ink)' }} disabled={loading} />
          </div>

          <div>
             <label style={labelStyle}>Live Status</label>
             <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={formData.is_live} 
                onChange={e => setFormData({...formData, is_live: e.target.checked})} 
                style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--ink)' }} 
                disabled={loading} 
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>Is Project Live?</span>
             </div>
          </div>

          <div>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: 'var(--ink)',
                color: '#fff',
                padding: '0.75rem 1.5rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'var(--border)',
                textTransform: 'uppercase',
                boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Logging...' : 'Log It'}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {builds.map(b => (
          <div key={b.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '1.5rem', 
            backgroundColor: '#fff', 
            border: 'var(--border)', 
            boxShadow: 'var(--shadow)',
            opacity: deletingId === b.id ? 0.5 : 1
          }}>
            <div style={{ flex: 1, paddingRight: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', margin: 0 }}>{b.title}</h3>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', backgroundColor: b.is_live ? 'var(--red)' : 'var(--yellow)', color: b.is_live ? '#fff' : 'inherit', padding: '0.1rem 0.4rem', border: '1px solid var(--ink)' }}>{b.is_live ? 'LIVE' : 'BUILDING'}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink)', margin: '0 0 1rem 0' }}>{b.description}</p>
              
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg)', border: '1px solid var(--ink)' }}>
                 <div style={{ height: '100%', width: `${b.progress}%`, backgroundColor: 'var(--ink)' }}></div>
              </div>
            </div>
            
            <button 
              onClick={() => handleDelete(b.id)}
              disabled={deletingId === b.id}
              style={{ alignSelf: 'flex-start', backgroundColor: 'transparent', color: 'var(--red)', border: 'none', padding: '0.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Remove
            </button>
          </div>
        ))}
        {builds.length === 0 && <p style={{ fontFamily: 'var(--font-mono)' }}>No active logs.</p>}
      </div>
    </div>
  )
}
