
const express = require('express');
const db = require('../database/db');
const { authenticateToken, checkSubscription } = require('../middleware/auth');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', authenticateToken, checkSubscription('basic'), (req, res) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = '';
  let params = [req.user.id];
  
  if (startDate && endDate) {
    dateFilter = 'AND DATE(created_at) BETWEEN DATE(?) AND DATE(?)';
    params.push(startDate, endDate);
  }

  const queries = [
    // Revenue analytics
    `SELECT 
      DATE(created_at) as date,
      SUM(total) as revenue,
      COUNT(*) as orders
     FROM orders 
     WHERE user_id = ? AND status != 'cancelled' ${dateFilter}
     GROUP BY DATE(created_at)
     ORDER BY date DESC
     LIMIT 30`,
    
    // Popular items
    `SELECT 
      json_extract(value, '$.name') as item_name,
      json_extract(value, '$.category') as category,
      SUM(json_extract(value, '$.quantity')) as total_quantity,
      SUM(json_extract(value, '$.price') * json_extract(value, '$.quantity')) as total_revenue
     FROM orders, json_each(orders.items)
     WHERE orders.user_id = ? AND orders.status != 'cancelled' ${dateFilter}
     GROUP BY item_name
     ORDER BY total_quantity DESC
     LIMIT 10`,
    
    // Table utilization
    `SELECT 
      t.table_number,
      COUNT(o.id) as total_orders,
      SUM(o.total) as revenue
     FROM tables t
     LEFT JOIN orders o ON t.id = o.table_id ${dateFilter ? 'AND' + dateFilter.replace('AND', '') : ''}
     WHERE t.user_id = ?
     GROUP BY t.id, t.table_number
     ORDER BY total_orders DESC`,
    
    // Inventory alerts
    `SELECT COUNT(*) as low_stock_count
     FROM inventory 
     WHERE user_id = ? AND current_stock <= min_stock`
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
      revenueData: results[0],
      popularItems: results[1],
      tableUtilization: results[2],
      lowStockCount: results[3][0]?.low_stock_count || 0
    });
  }).catch(err => {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Error fetching analytics data' });
  });
});

module.exports = router;
