import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, FileText } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // All our state variables
  const [notes, setNotes] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const lastActiveElement = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowNew(false);
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
      } catch (err) {
        console.error('Failed to fetch notes');
      }
    };
    fetchNotes();
  }, [navigate]);

  // Handle Deleting a note
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
    } catch (err) {
      alert('Network error while deleting note');
    }
  };

  // Handle Logging out
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSaveNote = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const token = localStorage.getItem('token');
    const payload = { title: newTitle?.trim(), content: newContent?.trim() };

    if (!payload.title || !payload.content || payload.content === '<p><br></p>') {
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
    } catch (err) {
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

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
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

            <button onClick={handleLogout} aria-label="Log out" className="glass-card" style={{ border: '1px solid var(--border-color)', background: 'transparent', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="notes-grid">
          {notes.map(note => (
            <div key={note.id} className="glass-card note-card">
              <div>
                <h3 className="note-title">{note.title}</h3>
                <p className="note-preview">
                  {note.content.replace(/<[^>]+>/g, '').length > 100 
                    ? note.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...' 
                    : note.content.replace(/<[^>]+>/g, '')}
                </p>
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
    </>
  );
};

export default Dashboard;
