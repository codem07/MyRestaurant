
const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../database/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all recipes for user
router.get('/', authenticateToken, async (req, res) => {
  const { category, difficulty, search, page = 1, limit = 10 } = req.query;
  
  try {
    const where = {
      userId: req.user.id,
      isActive: true
    };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.recipe.count({ where })
    ]);

    res.json({
      recipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// Get single recipe
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ recipe });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ message: 'Error fetching recipe' });
  }
});

// Create recipe
router.post('/', authenticateToken, [
  body('name').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('difficulty').notEmpty().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const recipe = await prisma.recipe.create({
      data: {
        ...req.body,
        userId: req.user.id
      }
    });

    res.status(201).json({ message: 'Recipe created successfully', recipe });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Error creating recipe' });
  }
});

// Update recipe
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const recipe = await prisma.recipe.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: req.body
    });

    if (recipe.count === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const updatedRecipe = await prisma.recipe.findUnique({
      where: { id: req.params.id }
    });

    res.json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ message: 'Error updating recipe' });
  }
});

// Delete recipe
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const recipe = await prisma.recipe.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: { isActive: false }
    });

    if (recipe.count === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Error deleting recipe' });
  }
});

module.exports = router;
