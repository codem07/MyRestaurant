
const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../database/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all orders
router.get('/', authenticateToken, async (req, res) => {
  const { status, orderType, page = 1, limit = 10 } = req.query;
  
  try {
    const where = { userId: req.user.id };

    if (status) where.status = status;
    if (orderType) where.orderType = orderType;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          table: true
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        table: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Create order
router.post('/', authenticateToken, [
  body('items').isArray().notEmpty(),
  body('subtotal').isNumeric(),
  body('total').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const order = await prisma.order.create({
      data: {
        ...req.body,
        userId: req.user.id,
        subtotal: parseFloat(req.body.subtotal),
        tax: parseFloat(req.body.tax) || 0,
        tip: parseFloat(req.body.tip) || 0,
        total: parseFloat(req.body.total)
      },
      include: {
        table: true
      }
    });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Update order
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (updateData.subtotal) updateData.subtotal = parseFloat(updateData.subtotal);
    if (updateData.tax) updateData.tax = parseFloat(updateData.tax);
    if (updateData.tip) updateData.tip = parseFloat(updateData.tip);
    if (updateData.total) updateData.total = parseFloat(updateData.total);

    const order = await prisma.order.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: updateData
    });

    if (order.count === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { table: true }
    });

    res.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
});

// Delete order
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await prisma.order.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (order.count === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
});

module.exports = router;
