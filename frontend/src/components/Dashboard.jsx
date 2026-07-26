import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, FileText } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  // Mock data for initial presentation
  const [notes, setNotes] = useState([
    { id: 1, title: 'Project Requirements', content: 'We need to implement a full-stack MERN application with a beautiful React frontend. Deadline is approaching fast!', date: 'Oct 24, 2026' },
    { id: 2, title: 'Meeting Notes: 10Pearls', content: 'Instructor mentioned CodeRabbit will automatically review our Pull Requests. We need to fix all HIGH and CRITICAL issues.', date: 'Oct 23, 2026' },
    { id: 3, title: 'Database Schema Idea', content: 'Users table (id, name, email, password_hash). Notes table (id, user_id, title, content, created_at).', date: 'Oct 22, 2026' },
  ]);

  const handleDelete = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleLogout = () => {
    // In a real app, clear tokens/state here
    navigate('/login');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px' }}>
      <header className="dashboard-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem', fontWeight: '700' }}>
            <FileText color="var(--primary-color)" /> My Notes
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Manage your daily tasks and thoughts.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button className="btn-primary" onClick={() => alert('New note creation coming soon!')} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> New Note
          </button>
          
          <button onClick={handleLogout} className="glass-card" style={{ border: '1px solid var(--border-color)', background: 'transparent', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
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
              <span>{note.date}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-icon" title="Edit Note" onClick={() => alert('Edit functionality coming soon!')}>
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
  );
};

export default Dashboard;
