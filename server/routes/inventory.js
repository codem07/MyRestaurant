
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const db = require('../database/db');
const { authenticateToken, checkSubscription } = require('../middleware/auth');

const router = express.Router();

// Get all inventory items
router.get('/', authenticateToken, (req, res) => {
  const { category, lowStock } = req.query;
  let query = 'SELECT * FROM inventory WHERE user_id = ?';
  let params = [req.user.id];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (lowStock === 'true') {
    query += ' AND current_stock <= min_stock';
  }

  query += ' ORDER BY name ASC';

  db.all(query, params, (err, items) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching inventory' });
    }
    res.json(items);
  });
});

// Create inventory item
router.post('/', authenticateToken, checkSubscription('free'), [
  body('name').notEmpty().trim(),
  body('currentStock').isNumeric(),
  body('unit').notEmpty().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name, category, currentStock, unit, minStock, costPerUnit,
    supplier, supplierContact, expiryDate, location, notes
  } = req.body;

  const itemId = uuidv4();
  const now = new Date().toISOString();

  db.run(`
    INSERT INTO inventory (
      id, user_id, name, category, current_stock, unit, min_stock,
      cost_per_unit, supplier, supplier_contact, expiry_date,
      location, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    itemId, req.user.id, name, category, currentStock, unit, minStock || 0,
    costPerUnit, supplier, supplierContact, expiryDate, location, notes, now, now
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating inventory item' });
    }

    res.status(201).json({
      id: itemId,
      message: 'Inventory item created successfully'
    });
  });
});

// Update inventory item
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const {
    name, category, currentStock, unit, minStock, costPerUnit,
    supplier, supplierContact, expiryDate, location, notes
  } = req.body;

  const now = new Date().toISOString();

  db.run(`
    UPDATE inventory SET
      name = ?, category = ?, current_stock = ?, unit = ?, min_stock = ?,
      cost_per_unit = ?, supplier = ?, supplier_contact = ?, expiry_date = ?,
      location = ?, notes = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `, [
    name, category, currentStock, unit, minStock, costPerUnit,
    supplier, supplierContact, expiryDate, location, notes, now, id, req.user.id
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating inventory item' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({ message: 'Inventory item updated successfully' });
  });
});

// Get low stock alerts
router.get('/alerts', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM inventory WHERE user_id = ? AND current_stock <= min_stock ORDER BY (current_stock - min_stock) ASC',
    [req.user.id],
    (err, items) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching alerts' });
      }
      res.json(items);
    }
  );
});

module.exports = router;
