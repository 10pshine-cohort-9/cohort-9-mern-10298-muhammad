import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, FileText, User, Search } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const extractTextFromHTML = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent.trim();
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const lastActiveElement = useRef(null);

  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return note.title.toLowerCase().includes(query) || extractTextFromHTML(note.content).toLowerCase().includes(query);
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowNew(false);
        setShowProfile(false);
        setTimeout(() => lastActiveElement.current?.focus(), 0);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/notes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          if (Array.isArray(data.data) && data.data.every(n => n.title && n.content && (n.date || n.created_at))) {
            setNotes(data.data);
          } else {
            console.error('Invalid data format received');
            setNotes([]);
          }
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch {
        console.error('Failed to fetch notes');
      }
    };
    fetchNotes();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotes(prev => prev.filter(note => note.id !== id));
      } else {
        alert('Failed to delete note on server');
      }
    } catch {
      alert('Network error while deleting note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleOpenProfile = async (e) => {
    lastActiveElement.current = e.currentTarget;
    setShowProfile(true);
    setUserProfile(null);
    setProfileError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        const p = data.data;
        if (p && p.id && p.full_name && p.email && p.created_at) {
          setUserProfile(p);
        } else {
          setProfileError('Invalid profile data received');
        }
      } else {
        setProfileError(data.error || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
      setProfileError('Network error while loading profile');
    }
  };

  const handleSaveNote = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const token = localStorage.getItem('token');
    const payload = { title: newTitle?.trim(), content: newContent?.trim() };
    const textContent = extractTextFromHTML(payload.content);

    if (!payload.title || !textContent) {
      alert('Title and content are required.');
      setIsSaving(false);
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `${import.meta.env.VITE_API_URL}/notes/${editingId}`
      : `${import.meta.env.VITE_API_URL}/notes`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (editingId) {
          setNotes(prev => prev.map(n => (n.id === editingId ? data.data : n)));
        } else {
          setNotes(prev => [data.data, ...prev]);
        }

        setShowNew(false);
        setEditingId(null);
        setNewTitle('');
        setNewContent('');
        setTimeout(() => lastActiveElement.current?.focus(), 0);
      } else {
        alert(data.error || 'Could not save note');
      }
    } catch {
      alert('Network error. Could not save note.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="animate-fade-in" style={{ padding: '0 20px' }}>
        <header className="dashboard-header">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem', fontWeight: '700' }}>
              <FileText color="var(--primary-color)" /> My Notes
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Manage your daily tasks and thoughts.</p>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 12px', gap: '8px' }}>
              <Search size={16} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search notes..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', width: '200px' }}
              />
            </div>

            <button
              className="btn-primary"
              onClick={(e) => {
                lastActiveElement.current = e.currentTarget;
                setEditingId(null);
                setNewTitle('');
                setNewContent('');
                setShowNew(true);
              }}
              style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={18} /> New Note
            </button>

            <button onClick={handleOpenProfile} aria-label="User Profile" className="glass-card" style={{ border: '1px solid var(--border-color)', background: 'transparent', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <User size={18} />
            </button>
          </div>
        </header>

        <main className="notes-grid">
          {filteredNotes.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              {searchQuery ? 'No notes match your search.' : 'No notes yet. Create one!'}
            </p>
          ) : filteredNotes.map(note => (
            <div key={note.id} className="glass-card note-card">
              <div>
                <h3 className="note-title">{note.title}</h3>
                <div 
                  className="note-preview ql-editor"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    padding: 0,
                    cursor: 'pointer'
                  }}
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              </div>

              <div className="note-footer">
                <span>{note.date || new Date(note.created_at).toLocaleDateString()}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn-icon"
                    title="Edit Note"
                    onClick={(e) => {
                      lastActiveElement.current = e.currentTarget;
                      setNewTitle(note.title);
                      setNewContent(note.content);
                      setEditingId(note.id);
                      setShowNew(true);
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-icon" title="Delete Note" onClick={() => handleDelete(note.id)} style={{ color: 'var(--error)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>

      {showNew && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <h2 id="modal-title" className="modal-title">{editingId ? 'Edit note' : 'Create a new note'}</h2>

            <div className="input-group">
              <label htmlFor="newTitle">Title</label>
              <input
                id="newTitle"
                className="input-field"
                placeholder="My awesome note"
                value={newTitle}
                autoFocus
                onChange={e => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="input-group" style={{ marginBottom: '50px' }}>
              <label htmlFor="newContent">Content</label>
              <ReactQuill
                id="newContent"
                theme="snow"
                value={newContent}
                onChange={setNewContent}
                placeholder="What do you want to remember?"
                style={{ height: '150px' }}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-primary" onClick={handleSaveNote} disabled={isSaving}>
                {isSaving ? 'Saving...' : (editingId ? 'Update' : 'Save')}
              </button>
              <button className="btn-secondary" onClick={() => {
                setShowNew(false);
                setTimeout(() => lastActiveElement.current?.focus(), 0);
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showProfile && (
        <div className="modal-backdrop" onClick={(e) => { if(e.target.className === 'modal-backdrop') setShowProfile(false); }}>
          <div className="glass-card modal-content" role="dialog" aria-modal="true" style={{ maxWidth: '400px', padding: 0, overflow: 'hidden' }}>
            
            {/* Top banner background */}
            <div style={{ height: '100px', background: 'linear-gradient(135deg, var(--primary-color), #8a2be2)', position: 'relative' }}>
               <div style={{ 
                 position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)',
                 width: '80px', height: '80px', borderRadius: '50%', background: 'var(--card-bg)', border: '4px solid var(--bg-color)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' 
               }}>
                 <User size={40} />
               </div>
            </div>

            <div style={{ padding: '50px 30px 30px', textAlign: 'center' }}>
              {profileError ? (
                <p style={{ color: 'var(--error)', margin: '40px 0' }}>{profileError}</p>
              ) : userProfile ? (
                <>
                  <h2 style={{ marginBottom: '5px', fontSize: '1.5rem' }}>{userProfile.full_name}</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{userProfile.email}</p>
                  
                  {/* Stats Row */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', margin: '20px 0 30px', padding: '15px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>{notes.length}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Notes</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>{new Date(userProfile.created_at).getFullYear()}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Joined</p>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--text-muted)', margin: '40px 0' }}>Loading profile...</p>
              )}

              <div className="modal-actions" style={{ justifyContent: 'center', gap: '15px' }}>
                <button className="btn-secondary" onClick={() => {
                  setShowProfile(false);
                  setTimeout(() => lastActiveElement.current?.focus(), 0);
                }}>
                  Close
                </button>
                <button className="btn-primary" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--error)' }}>
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
