
const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('restaurantName').notEmpty().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, restaurantName, phone, address } = req.body;
  const now = new Date().toISOString();

  db.run(`
    UPDATE users SET
      first_name = ?, last_name = ?, restaurant_name = ?, 
      phone = ?, restaurant_address = ?, updated_at = ?
    WHERE id = ?
  `, [firstName, lastName, restaurantName, phone, address, now, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating profile' });
    }

    res.json({ message: 'Profile updated successfully' });
  });
});

// Change password
router.put('/password', authenticateToken, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, req.user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    const now = new Date().toISOString();

    db.run(
      'UPDATE users SET password = ?, updated_at = ? WHERE id = ?',
      [hashedNewPassword, now, req.user.id],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Error updating password' });
        }

        res.json({ message: 'Password updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
