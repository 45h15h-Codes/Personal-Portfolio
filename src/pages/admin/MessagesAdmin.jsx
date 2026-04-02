import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const parseMobileAndMessage = (rawMessage = '') => {
    if (typeof rawMessage !== 'string') {
      return { mobile: '', body: '' }
    }

    const lines = rawMessage.split('\n')
    const firstLine = lines[0]?.trim() || ''

    if (!firstLine.toLowerCase().startsWith('mobile:')) {
      return { mobile: '', body: rawMessage }
    }

    const mobile = firstLine.slice(7).trim()
    const body = lines.slice(1).join('\n').trim()
    return { mobile, body }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    if (data) setMessages(data)
  }

  const handleMarkRead = async (id, currentStatus) => {
    if (currentStatus) return // Already read
    
    // Optimistic update
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read: true } : m))
    
    await supabase.from('contact_messages').update({ read: true }).eq('id', id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return
    
    setDeletingId(id)
    await supabase.from('contact_messages').delete().eq('id', id)
    await fetchMessages()
    setDeletingId(null)
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Inbox</h1>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '3rem', fontSize: '0.9rem' }}>
        Messages submitted from the contact form. Hook up Zapier/Make to forward these to WhatsApp.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map(m => {
          const parsed = parseMobileAndMessage(m.message)
          return (
          <div
            key={m.id} 
            onClick={() => handleMarkRead(m.id, m.read)}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '1.5rem', 
              backgroundColor: m.read ? '#fff' : 'var(--yellow)', 
              border: 'var(--border)', 
              boxShadow: m.read ? 'none' : 'var(--shadow)',
              opacity: deletingId === m.id ? 0.5 : 1,
              cursor: m.read ? 'default' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', margin: '0 0 0.2rem 0', color: 'var(--ink)' }}>{m.subject}</h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>From: {m.name}</span>
                {parsed.mobile && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                    Mobile: {parsed.mobile}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
                  {new Date(m.created_at).toLocaleDateString()}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(m.id) }}
                  disabled={deletingId === m.id}
                  style={{ backgroundColor: 'var(--red)', color: '#fff', border: 'var(--border)', padding: '0.3rem 0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
            
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink)', whiteSpace: 'pre-wrap', margin: 0, padding: '1rem', backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.1)' }}>
              {parsed.body}
            </p>
          </div>
        )})}
        {messages.length === 0 && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--muted)' }}>Inbox is empty.</p>}
      </div>
    </div>
  )
}
