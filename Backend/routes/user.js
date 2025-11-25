// routes/user.js
import express from "express"
import  bcrypt from 'bcryptjs';
import pool from '../config/database.js'; // Make sure this exports a pool
import  { authenticateToken } from '../middleware/auth.js';
const router = express.Router()

export default router.put('/password', authenticateToken, async (req, res) => {
  console.log('Received request body:', req.body);
  console.log('User from token:', req.user);

  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validation
    if (!currentPassword || !newPassword) {
      console.log('Missing required fields');
      return res.status(400).json({
        error: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      console.log('New password too short');
      return res.status(400).json({
        error: 'New password must be at least 6 characters long'
      });
    }

    // Get user from database using pool.query
    console.log('Querying user from database...');
    const [users] = await pool.query(
      'SELECT id, password_hash FROM users WHERE id = ?',
      [userId]
    );

    console.log('User query result:', users);

    if (users.length === 0) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const user = users[0];
    console.log('User found:', user);

    // Verify current password
    console.log('Verifying current password...');
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    console.log('Current password valid:', isCurrentPasswordValid);
    
    if (!isCurrentPasswordValid) {
      console.log('Current password is incorrect');
      return res.status(400).json({
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    console.log('Hashing new password...');
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database using pool.query
    console.log('Updating password in database...');
    const [updateResult] = await pool.query(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, userId]
    );

    console.log('Update result:', updateResult);
    console.log('Rows affected:', updateResult.affectedRows);

    if (updateResult.affectedRows === 0) {
      console.log('No rows affected by update query');
      throw new Error('No rows updated');
    }

    console.log(`Password updated successfully for user ID: ${userId}`);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password update error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});
