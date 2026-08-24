import express from 'express';
import { getNotes, createNote, updateNote, deleteNote, importNotes } from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the 'protect' middleware to all note routes to ensure user is logged in
router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

router.route('/:id')
  .put(protect, updateNote)
  .delete(protect, deleteNote);

router.post('/import', protect, importNotes);

export default router;
