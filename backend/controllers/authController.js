import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }

    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [fullName, email, passwordHash]
    );

    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      data: { id: result.insertId, fullName, email, token }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({
      success: true,
      data: { id: user.id, fullName: user.full_name, email: user.email, token }
    });
  } catch (error) {
    next(error);
  }
};
