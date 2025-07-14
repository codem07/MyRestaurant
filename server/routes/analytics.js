
const express = require('express');
const prisma = require('../database/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Today's stats
    const [todayOrders, todayRevenue, weeklyOrders, monthlyRevenue] = await Promise.all([
      prisma.order.count({
        where: {
          userId: req.user.id,
          createdAt: { gte: startOfDay }
        }
      }),
      prisma.order.aggregate({
        where: {
          userId: req.user.id,
          createdAt: { gte: startOfDay },
          status: 'completed'
        },
        _sum: { total: true }
      }),
      prisma.order.count({
        where: {
          userId: req.user.id,
          createdAt: { gte: startOfWeek }
        }
      }),
      prisma.order.aggregate({
        where: {
          userId: req.user.id,
          createdAt: { gte: startOfMonth },
          status: 'completed'
        },
        _sum: { total: true }
      })
    ]);

    // Low stock items count
    const lowStockCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM inventory 
      WHERE user_id = ${req.user.id} 
      AND current_stock <= min_stock
    `;

    // Active tables count
    const activeTables = await prisma.table.count({
      where: {
        userId: req.user.id,
        status: { not: 'available' }
      }
    });

    res.json({
      todayOrders,
      todayRevenue: todayRevenue._sum.total || 0,
      weeklyOrders,
      monthlyRevenue: monthlyRevenue._sum.total || 0,
      lowStockItems: parseInt(lowStockCount[0].count),
      activeTables
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

// Get sales data for charts
router.get('/sales', authenticateToken, async (req, res) => {
  const { period = '7d' } = req.query;
  
  try {
    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const salesData = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM orders 
      WHERE user_id = ${req.user.id} 
      AND created_at >= ${dateFilter}
      AND status = 'completed'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    res.json({ salesData });
  } catch (error) {
    console.error('Get sales data error:', error);
    res.status(500).json({ message: 'Error fetching sales data' });
  }
});

// Get popular items
router.get('/popular-items', authenticateToken, async (req, res) => {
  try {
    // This would require parsing the items JSON field
    // For now, return mock data
    const popularItems = [
      { name: 'Butter Chicken', orders: 45, revenue: 1350 },
      { name: 'Biryani', orders: 38, revenue: 1520 },
      { name: 'Masala Dosa', orders: 32, revenue: 960 },
      { name: 'Gulab Jamun', orders: 28, revenue: 560 },
      { name: 'Samosa', orders: 25, revenue: 375 }
    ];

    res.json({ popularItems });
  } catch (error) {
    console.error('Get popular items error:', error);
    res.status(500).json({ message: 'Error fetching popular items' });
  }
});

module.exports = router;
