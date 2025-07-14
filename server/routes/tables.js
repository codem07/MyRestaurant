
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const db = require('../database/db');
const { authenticateToken, checkSubscription } = require('../middleware/auth');

const router = express.Router();

// Get all tables
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM tables WHERE user_id = ? ORDER BY table_number ASC',
    [req.user.id],
    (err, tables) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching tables' });
      }
      res.json(tables);
    }
  );
});

// Create table
router.post('/', authenticateToken, checkSubscription('free'), [
  body('tableNumber').isInt({ min: 1 }),
  body('capacity').isInt({ min: 1 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { tableNumber, capacity, location, xPosition, yPosition } = req.body;
  const tableId = uuidv4();
  const now = new Date().toISOString();

  // Check if table number already exists
  db.get(
    'SELECT id FROM tables WHERE user_id = ? AND table_number = ?',
    [req.user.id, tableNumber],
    (err, existingTable) => {
      if (existingTable) {
        return res.status(400).json({ message: 'Table number already exists' });
      }

      db.run(`
        INSERT INTO tables (id, user_id, table_number, capacity, location, x_position, y_position, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [tableId, req.user.id, tableNumber, capacity, location, xPosition || 0, yPosition || 0, now, now], function(err) {
        if (err) {
          return res.status(500).json({ message: 'Error creating table' });
        }

        res.status(201).json({
          id: tableId,
          message: 'Table created successfully'
        });
      });
    }
  );
});

// Update table
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { tableNumber, capacity, location, xPosition, yPosition, status } = req.body;
  const now = new Date().toISOString();

  db.run(`
    UPDATE tables SET
      table_number = ?, capacity = ?, location = ?, x_position = ?, y_position = ?, 
      status = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `, [tableNumber, capacity, location, xPosition, yPosition, status, now, id, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating table' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.json({ message: 'Table updated successfully' });
  });
});

// Get reservations
router.get('/reservations', authenticateToken, (req, res) => {
  const { date } = req.query;
  let query = `
    SELECT r.*, t.table_number, t.capacity 
    FROM reservations r 
    LEFT JOIN tables t ON r.table_id = t.id 
    WHERE r.user_id = ?
  `;
  let params = [req.user.id];

  if (date) {
    query += ' AND DATE(r.reservation_date) = DATE(?)';
    params.push(date);
  }

  query += ' ORDER BY r.reservation_date ASC';

  db.all(query, params, (err, reservations) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching reservations' });
    }
    res.json(reservations);
  });
});

// Create reservation
router.post('/reservations', authenticateToken, checkSubscription('free'), [
  body('customerName').notEmpty().trim(),
  body('partySize').isInt({ min: 1 }),
  body('reservationDate').isISO8601()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    tableId, customerName, customerPhone, customerEmail, partySize,
    reservationDate, durationMinutes, specialRequests
  } = req.body;

  const reservationId = uuidv4();
  const now = new Date().toISOString();

  db.run(`
    INSERT INTO reservations (
      id, user_id, table_id, customer_name, customer_phone, customer_email,
      party_size, reservation_date, duration_minutes, special_requests,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    reservationId, req.user.id, tableId, customerName, customerPhone, customerEmail,
    partySize, reservationDate, durationMinutes || 120, specialRequests, now, now
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating reservation' });
    }

    res.status(201).json({
      id: reservationId,
      message: 'Reservation created successfully'
    });
  });
});

module.exports = router;
