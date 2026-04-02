import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function GuestbookAdmin() {
  const [notes, setNotes] = useState([])
  const [loadingIds, setLoadingIds] = useState(new Set())
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setFetchError('Failed to fetch notes: ' + error.message)
    } else {
      setNotes(data || [])
    }
  }

  const handleAction = async (id, action) => {
    // Add to loading set to prevent duplicate clicks
    setLoadingIds(prev => new Set(prev).add(id))

    if (action === 'approve') {
      const { error } = await supabase
        .from('guestbook')
        .update({ approved: true })
        .eq('id', id)
      
      if (!error) {
         setNotes(notes.map(n => n.id === id ? { ...n, approved: true } : n))
      }
    } else if (action === 'delete') {
      const { error } = await supabase
        .from('guestbook')
        .delete()
        .eq('id', id)
      
      if (!error) {
         setNotes(notes.filter(n => n.id !== id))
      }
    }

    // Remove from loading set
    setLoadingIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  // Split notes
  const unapproved = notes.filter(n => !n.approved)
  const approved = notes.filter(n => n.approved)

  const NoteCard = ({ note, isPending }) => {
    const isWorking = loadingIds.has(note.id)

    return (
      <div 
        style={{
          border: 'var(--border)',
          backgroundColor: 'var(--bg)',
          boxShadow: 'var(--shadow)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          opacity: isWorking ? 0.6 : 1,
          transition: 'all 0.2s',
          position: 'relative'
        }}
      >
        {isWorking && (
          <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.7em', fontFamily: 'var(--font-mono)' }}>
            Processing...
          </div>
        )}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem' }}>{note.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', backgroundColor: 'rgba(0,0,0,0.05)', padding: '0.2rem 0.5rem' }}>
              {note.project || 'General'}
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--ink)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
            "{note.message}"
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '2px dashed rgba(0,0,0,0.1)' }}>
          {isPending && (
            <button
              onClick={() => handleAction(note.id, 'approve')}
              disabled={isWorking}
              style={{
                flex: 1,
                backgroundColor: 'var(--ink)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.7rem',
                padding: '0.5rem',
                border: 'var(--border)',
                cursor: isWorking ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase'
              }}
            >
              Approve
            </button>
          )}
          <button
            onClick={() => handleAction(note.id, 'delete')}
            disabled={isWorking}
            style={{
              flex: isPending ? 1 : undefined,
              width: isPending ? undefined : '100%',
              backgroundColor: 'var(--red)',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.7rem',
              padding: '0.5rem',
              border: 'var(--border)',
              cursor: isWorking ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Guestbook Moderation</h1>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '3rem', fontSize: '0.9rem' }}>
        Approve or reject reactions left by visitors.
      </p>

      {fetchError && (
         <div style={{ backgroundColor: '#fff', border: '2px solid var(--red)', padding: '1rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--red)' }}>
            {fetchError}
         </div>
      )}

      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', borderBottom: 'var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        Pending Approval ({unapproved.length})
      </h2>
      
      {unapproved.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '3rem' }}>No pending reactions.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {unapproved.map(note => <NoteCard key={note.id} note={note} isPending={true} />)}
        </div>
      )}

      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', borderBottom: 'var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--muted)' }}>
        Approved & Live ({approved.length})
      </h2>
      
      {approved.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--muted)' }}>No live reactions.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {approved.map(note => <NoteCard key={note.id} note={note} isPending={false} />)}
        </div>
      )}
    </div>
  )
}
