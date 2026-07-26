import pool from '../config/db.js';

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
    
    if (!title) {
      return res.status(400).json({ success: false, error: 'Please provide a title' });
    }

    const [result] = await pool.query(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [req.user.id, title, content || '']
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
    
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }

    if (updates.length > 0) {
      values.push(id);
      await pool.query(`UPDATE notes SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    const [updatedNote] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
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
