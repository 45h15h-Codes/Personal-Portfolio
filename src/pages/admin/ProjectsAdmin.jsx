import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github_link: '',
    demo_link: '',
    tags: '',
    featured: false
  })
  
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (data) setProjects(data)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')

    // Client-side validation (007 Server-side validated schema mirroring)
    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Title and description are required.')
      return
    }

    if (formData.github_link && !formData.github_link.startsWith('http')) {
      setFormError('GitHub link must be a valid URL starting with http/https.')
      return
    }

    setLoading(true)

    // Process tags
    const tagsArray = formData.tags 
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : []

    const newProject = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      github_link: formData.github_link.trim() || null,
      demo_link: formData.demo_link.trim() || null,
      tags: tagsArray,
      featured: formData.featured
    }

    const { error } = await supabase.from('projects').insert([newProject])

    if (error) {
      setFormError('Failed to create project: ' + error.message)
    } else {
      setFormData({ title: '', description: '', github_link: '', demo_link: '', tags: '', featured: false })
      await fetchProjects()
    }

    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return
    
    setDeletingId(id)
    await supabase.from('projects').delete().eq('id', id)
    await fetchProjects()
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
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Projects</h1>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '3rem', fontSize: '0.9rem' }}>
        Add and manage the projects displayed on your portfolio.
      </p>

      {/* Add Form */}
      <div style={{ backgroundColor: 'var(--yellow)', border: 'var(--border)', boxShadow: 'var(--shadow-lg)', padding: '2rem', marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', margin: '0 0 1.5rem 0' }}>Launch New Project</h2>
        
        {formError && (
          <div style={{ padding: '1rem', backgroundColor: '#fff', border: '2px solid var(--red)', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Project Title *</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={inputStyle} disabled={loading} required maxLength={100} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Description *</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, resize: 'vertical', minHeight: '100px'}} disabled={loading} required maxLength={500} />
          </div>

          <div>
            <label style={labelStyle}>GitHub URL</label>
            <input type="url" placeholder="https://github.com/..." value={formData.github_link} onChange={e => setFormData({...formData, github_link: e.target.value})} style={inputStyle} disabled={loading} />
          </div>

          <div>
            <label style={labelStyle}>Live Demo URL</label>
            <input type="url" placeholder="https://..." value={formData.demo_link} onChange={e => setFormData({...formData, demo_link: e.target.value})} style={inputStyle} disabled={loading} />
          </div>

          <div>
             <label style={labelStyle}>Tags (Comma separated)</label>
             <input type="text" placeholder="React, Node.js, AI" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} style={inputStyle} disabled={loading} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} disabled={loading} style={{ width: '20px', height: '20px', accentColor: 'var(--ink)' }} />
             <label htmlFor="featured" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>Highlight as Featured Project</label>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                backgroundColor: 'var(--ink)',
                color: '#fff',
                padding: '1rem 2.5rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'var(--border)',
                textTransform: 'uppercase',
                boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Executing...' : '+ Deploy Project'}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', borderBottom: 'var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        Active Projects ({projects.length})
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {projects.map(p => (
          <div key={p.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.5rem', 
            backgroundColor: 'var(--bg)', 
            border: 'var(--border)', 
            boxShadow: 'var(--shadow)',
            opacity: deletingId === p.id ? 0.5 : 1
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', margin: 0 }}>{p.title}</h3>
                {p.featured && <span style={{ backgroundColor: 'var(--red)', color: '#fff', fontSize: '0.6rem', padding: '0.1rem 0.4rem', fontFamily: 'var(--font-mono)', fontWeight: 700, border: '1px solid var(--ink)' }}>FEATURED</span>}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', gap: '1rem' }}>
                 {p.github_link && <span>Has Code</span>}
                 {p.demo_link && <span>Has Demo</span>}
                 <span>{p.tags?.length || 0} Tags</span>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(p.id)}
              disabled={deletingId === p.id}
              style={{ backgroundColor: 'var(--red)', color: '#fff', border: 'var(--border)', padding: '0.5rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        ))}
        {projects.length === 0 && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--muted)' }}>No projects deployed yet.</p>}
      </div>
    </div>
  )
}
