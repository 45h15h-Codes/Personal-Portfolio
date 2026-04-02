import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    level: 90
  })
  
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    const { data } = await supabase.from('skills').select('*').order('created_at', { ascending: false })
    if (data) setSkills(data)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')
    const parsedLevel = Number(formData.level)

    if (!formData.name.trim()) {
      setFormError('Name is required.')
      return
    }

    if (!Number.isFinite(parsedLevel) || parsedLevel < 0 || parsedLevel > 100) {
      setFormError('Proficiency must be a number between 0 and 100.')
      return
    }

    setLoading(true)

    const newSkill = {
      name: formData.name.trim(),
      category: formData.category,
      level: Math.round(parsedLevel)
    }

    const { error } = await supabase.from('skills').insert([newSkill])

    if (error) {
      setFormError('Failed to create skill: ' + error.message)
    } else {
      setFormData({ name: '', category: 'frontend', level: 90 })
      await fetchSkills()
    }

    setLoading(false)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    await supabase.from('skills').delete().eq('id', id)
    await fetchSkills()
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
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Skills Matrix</h1>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '3rem', fontSize: '0.9rem' }}>
        Manage your technical skills and proficiency.
      </p>

      {/* Add Form */}
      <div style={{ backgroundColor: '#fff', border: 'var(--border)', boxShadow: 'var(--shadow-lg)', padding: '2rem', marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', margin: '0 0 1.5rem 0' }}>Add Skill</h2>
        
        {formError && (
          <div style={{ padding: '1rem', backgroundColor: '#fff', border: '2px solid var(--red)', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) minmax(130px, 1fr) minmax(120px, 0.8fr) auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={labelStyle}>Skill Name *</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} disabled={loading} required maxLength={50} />
          </div>

          <div>
             <label style={labelStyle}>Category</label>
             <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle} disabled={loading}>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="tools">Tools & DevOps</option>
             </select>
          </div>

          <div>
            <label style={labelStyle}>Proficiency %</label>
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              value={formData.level}
              onChange={e => setFormData({...formData, level: e.target.value})}
              style={inputStyle}
              disabled={loading}
              required
            />
          </div>

          <div style={{ paddingBottom: '2px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                backgroundColor: 'var(--yellow)',
                color: 'var(--ink)',
                padding: '0.75rem 1.5rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'var(--border)',
                textTransform: 'uppercase',
                boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
                whiteSpace: 'nowrap'
              }}
            >
              {loading ? '+' : '+ Add'}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {skills.map(s => (
          <div key={s.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem', 
            backgroundColor: 'var(--bg)', 
            border: 'var(--border)', 
            boxShadow: '2px 2px 0 rgba(0,0,0,0.05)',
            opacity: deletingId === s.id ? 0.5 : 1
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>{s.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--ink)', marginTop: '0.25rem' }}>
                Proficiency: {Number.isFinite(Number(s.level)) ? Math.round(Number(s.level)) : 0}%
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{s.category}</div>
            </div>
            <button 
              onClick={() => handleDelete(s.id)}
              disabled={deletingId === s.id}
              style={{ backgroundColor: 'transparent', color: 'var(--red)', border: 'none', padding: '0.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer' }}
              title="Delete"
            >
              X
            </button>
          </div>
        ))}
        {skills.length === 0 && <p style={{ gridColumn: '1 / -1', fontFamily: 'var(--font-mono)' }}>No skills added.</p>}
      </div>
    </div>
  )
}
