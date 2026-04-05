import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

function ImagePreview({ file, existingUrl }) {
  const [url, setUrl] = useState(existingUrl || null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setUrl(existingUrl || null);
    }
  }, [file, existingUrl]);

  if (!url) return null;

  return (
    <div style={{ position: 'relative', width: '100px', height: '100px', backgroundColor: 'var(--bg)', border: 'var(--border)', overflow: 'hidden', flexShrink: 0, boxShadow: '4px 4px 0 rgba(0,0,0,0.8)' }}>
      <img src={url} alt="Preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  )
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_description: '',
    thumbnail: null,
    existing_thumbnail: null,
    images: [],
    existing_images: [],
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

    let thumbnailUrl = formData.existing_thumbnail;
    let imageURLs = formData.existing_images || [];

    try {
      if (formData.thumbnail) {
        const fileExt = formData.thumbnail.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('project_images').upload(fileName, formData.thumbnail);
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage.from('project_images').getPublicUrl(fileName);
        thumbnailUrl = publicUrlData.publicUrl;
      }

      if (formData.images && formData.images.length > 0) {
        imageURLs = []; // Replacing the gallery if new images are supplied
        for (const file of formData.images) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage.from('project_images').upload(fileName, file);
          if (uploadError) throw uploadError;
          
          const { data: publicUrlData } = supabase.storage.from('project_images').getPublicUrl(fileName);
          imageURLs.push(publicUrlData.publicUrl);
        }
      }
    } catch (err) {
      setFormError('Image upload failed: ' + err.message);
      setLoading(false);
      return;
    }

    // Process tags
    const tagsArray = formData.tags 
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : []

    const projectData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      detailed_description: formData.detailed_description.trim() || null,
      thumbnail: thumbnailUrl,
      images: imageURLs,
      github_link: formData.github_link.trim() || null,
      demo_link: formData.demo_link.trim() || null,
      tags: tagsArray,
      featured: formData.featured
    }

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from('projects').update(projectData).eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('projects').insert([projectData]);
      error = insertError;
    }

    if (error) {
      setFormError(`Failed to ${editingId ? 'update' : 'create'} project: ` + error.message)
    } else {
      cancelEdit();
      await fetchProjects()
    }

    setLoading(false)
  }

  const handleEditClick = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      detailed_description: project.detailed_description || '',
      thumbnail: null,
      existing_thumbnail: project.thumbnail,
      images: [],
      existing_images: project.images || [],
      github_link: project.github_link || '',
      demo_link: project.demo_link || '',
      tags: project.tags ? project.tags.join(', ') : '',
      featured: project.featured
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', detailed_description: '', thumbnail: null, existing_thumbnail: null, images: [], existing_images: [], github_link: '', demo_link: '', tags: '', featured: false });
    if(document.getElementById('thumbnail')) document.getElementById('thumbnail').value = '';
    if(document.getElementById('images')) document.getElementById('images').value = '';
  }

  const handleDelete = async (id, projectImages, projectThumbnail) => {
    if (!window.confirm("Are you sure you want to delete this project? Data and images will be permanently removed.")) return
    
    setDeletingId(id)

    // Helper to extract file name from public URL
    const tryDeleteFromStorage = async (url) => {
      if (!url) return;
      try {
        const urlParts = url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        await supabase.storage.from('project_images').remove([fileName]);
      } catch (e) {
        console.error("Failed to delete image: ", e);
      }
    };

    if (projectThumbnail) {
      await tryDeleteFromStorage(projectThumbnail);
    }
    if (projectImages && projectImages.length > 0) {
      for (const imgUrl of projectImages) {
        await tryDeleteFromStorage(imgUrl);
      }
    }

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
      <div style={{ backgroundColor: editingId ? 'var(--bg)' : 'var(--yellow)', border: editingId ? '3px solid var(--ink)' : 'var(--border)', boxShadow: 'var(--shadow-lg)', padding: '2rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', margin: 0 }}>
            {editingId ? `Editing Project: ${formData.title}` : 'Launch New Project'}
          </h2>
          {editingId && (
            <button onClick={cancelEdit} style={{ backgroundColor: 'var(--red)', color: '#fff', padding: '0.4rem 1rem', border: 'var(--border)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem' }}>
              Cancel Edit
            </button>
          )}
        </div>
        
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

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Detailed Description (Markdown later/Optional)</label>
            <textarea value={formData.detailed_description} onChange={e => setFormData({...formData, detailed_description: e.target.value})} style={{...inputStyle, resize: 'vertical', minHeight: '150px'}} disabled={loading} maxLength={5000} />
          </div>

          <div>
             <label style={labelStyle}>Thumbnail Image {formData.existing_thumbnail && <span style={{color: 'var(--muted)', textTransform:'none'}}>(Will replace current file)</span>}</label>
             <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
               <input type="file" id="thumbnail" accept="image/*" onChange={e => setFormData({...formData, thumbnail: e.target.files[0]})} style={{...inputStyle, flex: 1}} disabled={loading} />
               <ImagePreview file={formData.thumbnail} existingUrl={formData.existing_thumbnail} />
             </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
             <label style={labelStyle}>Gallery Images {formData.existing_images?.length > 0 && <span style={{color: 'var(--muted)', textTransform:'none'}}>(Selecting new overrides entire gallery)</span>}</label>
             <input type="file" id="images" accept="image/*" multiple onChange={e => setFormData({...formData, images: Array.from(e.target.files)})} style={inputStyle} disabled={loading} />
             
             {(formData.images?.length > 0 || formData.existing_images?.length > 0) && (
               <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem', padding: '1rem', border: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                 {formData.images?.length > 0 
                    ? formData.images.map((f, i) => <ImagePreview key={`new-${i}`} file={f} />)
                    : formData.existing_images?.map((url, i) => <ImagePreview key={`exist-${i}`} existingUrl={url} />)
                 }
               </div>
             )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1' }}>
             <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} disabled={loading} style={{ width: '20px', height: '20px', accentColor: 'var(--ink)' }} />
             <label htmlFor="featured" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>Highlight as Featured Project</label>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
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
              {loading ? 'Executing...' : (editingId ? 'Update Project' : '+ Deploy Project')}
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
                 <span>{p.images?.length || 0} Images</span>
                 {p.detailed_description && <span>Rich Desc.</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {p.thumbnail && <img src={p.thumbnail} alt="thumb" style={{ width: '40px', height: '40px', objectFit: 'cover', border: 'var(--border)' }} />}
              <button 
                onClick={() => handleEditClick(p)}
                disabled={loading || deletingId === p.id}
                style={{ backgroundColor: 'transparent', color: 'var(--ink)', border: '2px solid var(--ink)', padding: '0.5rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(p.id, p.images, p.thumbnail)}
                disabled={deletingId === p.id}
                style={{ backgroundColor: 'var(--red)', color: '#fff', border: 'var(--border)', padding: '0.5rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--muted)' }}>No projects deployed yet.</p>}
      </div>
    </div>
  )
}
