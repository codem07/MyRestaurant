
const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../database/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all inventory items
router.get('/', authenticateToken, async (req, res) => {
  const { category, status, search, page = 1, limit = 10 } = req.query;
  
  try {
    const where = { userId: req.user.id };

    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { supplier: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.inventory.count({ where })
    ]);

    // Add status based on stock levels
    const itemsWithStatus = items.map(item => ({
      ...item,
      status: item.currentStock <= item.minStock ? 'low' : 'good'
    }));

    res.json({
      items: itemsWithStatus,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Error fetching inventory' });
  }
});

// Get single inventory item
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await prisma.inventory.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({ item });
  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({ message: 'Error fetching inventory item' });
  }
});

// Create inventory item
router.post('/', authenticateToken, [
  body('name').notEmpty().trim(),
  body('currentStock').isNumeric(),
  body('unit').notEmpty().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const item = await prisma.inventory.create({
      data: {
        ...req.body,
        userId: req.user.id,
        currentStock: parseFloat(req.body.currentStock),
        minStock: parseFloat(req.body.minStock) || 0,
        costPerUnit: req.body.costPerUnit ? parseFloat(req.body.costPerUnit) : null,
        lastRestocked: req.body.lastRestocked ? new Date(req.body.lastRestocked) : null,
        expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null
      }
    });

    res.status(201).json({ message: 'Inventory item created successfully', item });
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(500).json({ message: 'Error creating inventory item' });
  }
});

// Update inventory item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (updateData.currentStock) updateData.currentStock = parseFloat(updateData.currentStock);
    if (updateData.minStock) updateData.minStock = parseFloat(updateData.minStock);
    if (updateData.costPerUnit) updateData.costPerUnit = parseFloat(updateData.costPerUnit);
    if (updateData.lastRestocked) updateData.lastRestocked = new Date(updateData.lastRestocked);
    if (updateData.expiryDate) updateData.expiryDate = new Date(updateData.expiryDate);

    const item = await prisma.inventory.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: updateData
    });

    if (item.count === 0) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    const updatedItem = await prisma.inventory.findUnique({
      where: { id: req.params.id }
    });

    res.json({ message: 'Inventory item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: 'Error updating inventory item' });
  }
});

// Delete inventory item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await prisma.inventory.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (item.count === 0) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({ message: 'Error deleting inventory item' });
  }
});

// Get low stock items
router.get('/alerts/low-stock', authenticateToken, async (req, res) => {
  try {
    const lowStockItems = await prisma.$queryRaw`
      SELECT * FROM inventory 
      WHERE user_id = ${req.user.id} 
      AND current_stock <= min_stock
      ORDER BY (current_stock / min_stock) ASC
    `;

    res.json({ items: lowStockItems });
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({ message: 'Error fetching low stock items' });
  }
});

module.exports = router;
