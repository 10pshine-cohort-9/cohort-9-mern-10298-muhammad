import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, FileText } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // All our state variables
  const [notes, setNotes] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing an existing note

  // Fetch all notes when the dashboard loads
  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/notes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setNotes(data.data);
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
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setNotes(notes.filter(note => note.id !== id));
  };

  // Handle Logging out
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Handle Saving (Both Create and Edit)
  const handleSaveNote = async () => {
    const token = localStorage.getItem('token');
    const payload = { title: newTitle, content: newContent };
    
    // If we have an editingId, it's a PUT request. Otherwise, it's a POST request.
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/notes/${editingId}` 
      : 'http://localhost:5000/api/notes';

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
        // Replace the old note with the newly updated one in the UI
        setNotes(notes.map(n => (n.id === editingId ? data.data : n)));
      } else {
        // Add the brand new note to the UI
        setNotes([...notes, data.data]);
      }
      
      // Close and reset the modal
      setShowNew(false);
      setEditingId(null);
      setNewTitle('');
      setNewContent('');
    } else {
      alert(data.error || 'Could not save note');
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
              onClick={() => {
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
                  {note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content}
                </p>
              </div>

              <div className="note-footer">
                <span>{note.date || new Date(note.created_at).toLocaleDateString()}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn-icon" 
                    title="Edit Note" 
                    onClick={() => {
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

      {/* ---------- NOTE MODAL (Used for both Create and Edit) ---------- */}
      {showNew && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content">
            <h2 className="modal-title">{editingId ? 'Edit note' : 'Create a new note'}</h2>

            <div className="input-group">
              <label htmlFor="newTitle">Title</label>
              <input
                id="newTitle"
                className="input-field"
                placeholder="My awesome note"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="newContent">Content</label>
              <textarea
                id="newContent"
                className="input-field"
                rows={4}
                placeholder="What do you want to remember?"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                required
              />
            </div>

            <div className="modal-actions">
              <button className="btn-primary" onClick={handleSaveNote}>
                {editingId ? 'Update' : 'Save'}
              </button>
              <button className="btn-secondary" onClick={() => setShowNew(false)}>
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
