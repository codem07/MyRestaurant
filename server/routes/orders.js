
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const db = require('../database/db');
const { authenticateToken, checkSubscription } = require('../middleware/auth');

const router = express.Router();

// Get all orders
router.get('/', authenticateToken, (req, res) => {
  const { status, date, tableId } = req.query;
  let query = `
    SELECT o.*, t.table_number, t.capacity 
    FROM orders o 
    LEFT JOIN tables t ON o.table_id = t.id 
    WHERE o.user_id = ?
  `;
  let params = [req.user.id];

  if (status) {
    query += ' AND o.status = ?';
    params.push(status);
  }

  if (date) {
    query += ' AND DATE(o.created_at) = DATE(?)';
    params.push(date);
  }

  if (tableId) {
    query += ' AND o.table_id = ?';
    params.push(tableId);
  }

  query += ' ORDER BY o.created_at DESC';

  db.all(query, params, (err, orders) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching orders' });
    }

    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items || '[]')
    }));

    res.json(formattedOrders);
  });
});

// Create order
router.post('/', authenticateToken, checkSubscription('free'), [
  body('items').isArray().notEmpty(),
  body('subtotal').isNumeric(),
  body('total').isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    tableId, customerName, customerPhone, orderType, items,
    subtotal, tax, tip, total, specialInstructions
  } = req.body;

  const orderId = uuidv4();
  const now = new Date().toISOString();

  db.run(`
    INSERT INTO orders (
      id, user_id, table_id, customer_name, customer_phone, order_type,
      items, subtotal, tax, tip, total, special_instructions,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    orderId, req.user.id, tableId, customerName, customerPhone, orderType || 'dine-in',
    JSON.stringify(items), subtotal, tax || 0, tip || 0, total,
    specialInstructions, now, now
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating order' });
    }

    // Update table status if tableId provided
    if (tableId) {
      db.run(
        'UPDATE tables SET status = "occupied" WHERE id = ? AND user_id = ?',
        [tableId, req.user.id]
      );
    }

    res.status(201).json({
      id: orderId,
      message: 'Order created successfully'
    });
  });
});

// Update order status
router.patch('/:id/status', authenticateToken, [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'])
], (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const now = new Date().toISOString();

  db.run(
    'UPDATE orders SET status = ?, updated_at = ? WHERE id = ? AND user_id = ?',
    [status, now, id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating order status' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // If order is completed, free up the table
      if (status === 'completed') {
        db.run(
          'UPDATE tables SET status = "available" WHERE id = (SELECT table_id FROM orders WHERE id = ?)',
          [id]
        );
      }

      res.json({ message: 'Order status updated successfully' });
    }
  );
});

// Get order analytics
router.get('/analytics', authenticateToken, checkSubscription('basic'), (req, res) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = '';
  let params = [req.user.id];
  
  if (startDate && endDate) {
    dateFilter = 'AND DATE(created_at) BETWEEN DATE(?) AND DATE(?)';
    params.push(startDate, endDate);
  }

  const queries = [
    `SELECT COUNT(*) as total_orders FROM orders WHERE user_id = ? ${dateFilter}`,
    `SELECT SUM(total) as total_revenue FROM orders WHERE user_id = ? AND status != 'cancelled' ${dateFilter}`,
    `SELECT AVG(total) as avg_order_value FROM orders WHERE user_id = ? AND status != 'cancelled' ${dateFilter}`,
    `SELECT status, COUNT(*) as count FROM orders WHERE user_id = ? ${dateFilter} GROUP BY status`
  ];

  Promise.all(queries.map(query => {
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  })).then(results => {
    res.json({
      totalOrders: results[0][0]?.total_orders || 0,
      totalRevenue: results[1][0]?.total_revenue || 0,
      avgOrderValue: results[2][0]?.avg_order_value || 0,
      ordersByStatus: results[3]
    });
  }).catch(err => {
    res.status(500).json({ message: 'Error fetching analytics' });
  });
});

module.exports = router;
