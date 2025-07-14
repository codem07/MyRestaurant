
const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../database/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all tables
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tables = await prisma.table.findMany({
      where: { userId: req.user.id },
      include: {
        orders: {
          where: {
            status: { in: ['pending', 'in-progress'] }
          }
        },
        reservations: {
          where: {
            reservationDate: {
              gte: new Date(),
              lte: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next 24 hours
            },
            status: 'confirmed'
          }
        }
      },
      orderBy: { tableNumber: 'asc' }
    });

    res.json({ tables });
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({ message: 'Error fetching tables' });
  }
});

// Get single table
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const table = await prisma.table.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        orders: true,
        reservations: true
      }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.json({ table });
  } catch (error) {
    console.error('Get table error:', error);
    res.status(500).json({ message: 'Error fetching table' });
  }
});

// Create table
router.post('/', authenticateToken, [
  body('tableNumber').isInt({ min: 1 }),
  body('capacity').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const table = await prisma.table.create({
      data: {
        ...req.body,
        userId: req.user.id,
        tableNumber: parseInt(req.body.tableNumber),
        capacity: parseInt(req.body.capacity),
        xPosition: parseFloat(req.body.xPosition) || 0,
        yPosition: parseFloat(req.body.yPosition) || 0
      }
    });

    res.status(201).json({ message: 'Table created successfully', table });
  } catch (error) {
    console.error('Create table error:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Table number already exists' });
    } else {
      res.status(500).json({ message: 'Error creating table' });
    }
  }
});

// Update table
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (updateData.tableNumber) updateData.tableNumber = parseInt(updateData.tableNumber);
    if (updateData.capacity) updateData.capacity = parseInt(updateData.capacity);
    if (updateData.xPosition !== undefined) updateData.xPosition = parseFloat(updateData.xPosition);
    if (updateData.yPosition !== undefined) updateData.yPosition = parseFloat(updateData.yPosition);

    const table = await prisma.table.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: updateData
    });

    if (table.count === 0) {
      return res.status(404).json({ message: 'Table not found' });
    }

    const updatedTable = await prisma.table.findUnique({
      where: { id: req.params.id }
    });

    res.json({ message: 'Table updated successfully', table: updatedTable });
  } catch (error) {
    console.error('Update table error:', error);
    res.status(500).json({ message: 'Error updating table' });
  }
});

// Delete table
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const table = await prisma.table.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (table.count === 0) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({ message: 'Error deleting table' });
  }
});

module.exports = router;
