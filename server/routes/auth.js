
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('restaurantName').notEmpty().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName, restaurantName, phone, address } = req.body;

  try {
    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const userId = uuidv4();
      const subscriptionExpiresAt = new Date();
      subscriptionExpiresAt.setDate(subscriptionExpiresAt.getDate() + 30); // 30-day free trial

      db.run(`
        INSERT INTO users (id, email, password, first_name, last_name, restaurant_name, phone, restaurant_address, subscription_expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [userId, email, hashedPassword, firstName, lastName, restaurantName, phone, address, subscriptionExpiresAt.toISOString()], function(err) {
        if (err) {
          return res.status(500).json({ message: 'Error creating user' });
        }

        const token = jwt.sign(
          { id: userId, email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        res.status(201).json({
          message: 'User created successfully',
          token,
          user: {
            id: userId,
            email,
            firstName,
            lastName,
            restaurantName,
            subscriptionPlan: 'free',
            subscriptionStatus: 'active'
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          restaurantName: user.restaurant_name,
          subscriptionPlan: user.subscription_plan,
          subscriptionStatus: user.subscription_status,
          subscriptionExpiresAt: user.subscription_expires_at
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      restaurantName: req.user.restaurant_name,
      subscriptionPlan: req.user.subscription_plan,
      subscriptionStatus: req.user.subscription_status,
      subscriptionExpiresAt: req.user.subscription_expires_at
    }
  });
});

module.exports = router;
