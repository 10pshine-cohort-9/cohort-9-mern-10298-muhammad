import pool from '../config/db.js';
import sanitizeHtml from 'sanitize-html';

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'p', 'br', 'strong', 'em', 'u', 's', 'blockquote', 'code', 'pre']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    '*': ['style', 'class'],
    'img': ['src', 'alt', 'width', 'height']
  }
};

const sanitizeContent = (content) => {
  if (typeof content !== 'string') return '';
  return sanitizeHtml(content, sanitizeOptions);
};

const isValidNote = (note) => {
  return note && typeof note === 'object' && typeof note.title === 'string' && typeof note.content === 'string';
};

export const getNotes = async (req, res, next) => {
  try {
    const [notes] = await pool.query('SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide a valid title' });
    }

    const safeContent = sanitizeContent(content || '');

    const [result] = await pool.query(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [req.user.id, title, safeContent]
    );

    const [newNote] = await pool.query('SELECT * FROM notes WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ success: true, data: newNote[0] });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const [note] = await pool.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (note.length === 0) {
      return res.status(404).json({ success: false, error: 'Note not found or unauthorized' });
    }

    const updates = [];
    const values = [];
    
    if (title !== undefined && typeof title === 'string') {
      updates.push('title = ?');
      values.push(title);
    }
    if (content !== undefined && typeof content === 'string') {
      updates.push('content = ?');
      values.push(sanitizeContent(content));
    }

    if (updates.length > 0) {
      values.push(id, req.user.id);
      const [updateResult] = await pool.query(`UPDATE notes SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`, values);
      
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'Note not found or unauthorized' });
      }
    }

    const [updatedNote] = await pool.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [id, req.user.id]);
    
    if (updatedNote.length === 0) {
      return res.status(404).json({ success: false, error: 'Note not found or unauthorized' });
    }
    
    res.status(200).json({ success: true, data: updatedNote[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [id, req.user.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Note not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

export const importNotes = async (req, res, next) => {
  try {
    const { notes } = req.body;
    
    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({ success: false, error: 'Please provide an array of notes' });
    }

    const isValid = notes.every(isValidNote);
    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Invalid note format in array' });
    }

    const values = notes.map(note => [
      req.user.id,
      note.title,
      sanitizeContent(note.content)
    ]);

    const [result] = await pool.query(
      'INSERT INTO notes (user_id, title, content) VALUES ?',
      [values]
    );

    res.status(201).json({ success: true, data: { importedCount: result.affectedRows } });
  } catch (error) {
    next(error);
  }
};
