
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const db = require('../database/db');
const { authenticateToken, checkSubscription } = require('../middleware/auth');

const router = express.Router();

// Get all recipes for user
router.get('/', authenticateToken, (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM recipes WHERE user_id = ? AND is_active = 1';
  let params = [req.user.id];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, recipes) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching recipes' });
    }

    const formattedRecipes = recipes.map(recipe => ({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients || '[]'),
      instructions: JSON.parse(recipe.instructions || '[]'),
      nutritional_info: JSON.parse(recipe.nutritional_info || '{}'),
      tags: JSON.parse(recipe.tags || '[]')
    }));

    res.json(formattedRecipes);
  });
});

// Create recipe
router.post('/', authenticateToken, checkSubscription('free'), [
  body('name').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('ingredients').isArray(),
  body('instructions').isArray()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name, description, category, prepTime, cookTime, servings,
    difficulty, costPerServing, imageUrl, ingredients, instructions,
    nutritionalInfo, tags
  } = req.body;

  const recipeId = uuidv4();
  const now = new Date().toISOString();

  db.run(`
    INSERT INTO recipes (
      id, user_id, name, description, category, prep_time, cook_time,
      servings, difficulty, cost_per_serving, image_url, ingredients,
      instructions, nutritional_info, tags, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    recipeId, req.user.id, name, description, category, prepTime, cookTime,
    servings, difficulty, costPerServing, imageUrl, JSON.stringify(ingredients),
    JSON.stringify(instructions), JSON.stringify(nutritionalInfo || {}),
    JSON.stringify(tags || []), now, now
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating recipe' });
    }

    res.status(201).json({
      id: recipeId,
      message: 'Recipe created successfully'
    });
  });
});

// Update recipe
router.put('/:id', authenticateToken, checkSubscription('free'), [
  body('name').notEmpty().trim(),
  body('category').notEmpty().trim()
], (req, res) => {
  const { id } = req.params;
  const {
    name, description, category, prepTime, cookTime, servings,
    difficulty, costPerServing, imageUrl, ingredients, instructions,
    nutritionalInfo, tags
  } = req.body;

  const now = new Date().toISOString();

  db.run(`
    UPDATE recipes SET
      name = ?, description = ?, category = ?, prep_time = ?, cook_time = ?,
      servings = ?, difficulty = ?, cost_per_serving = ?, image_url = ?,
      ingredients = ?, instructions = ?, nutritional_info = ?, tags = ?,
      updated_at = ?
    WHERE id = ? AND user_id = ?
  `, [
    name, description, category, prepTime, cookTime, servings, difficulty,
    costPerServing, imageUrl, JSON.stringify(ingredients || []),
    JSON.stringify(instructions || []), JSON.stringify(nutritionalInfo || {}),
    JSON.stringify(tags || []), now, id, req.user.id
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating recipe' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ message: 'Recipe updated successfully' });
  });
});

// Delete recipe
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run(
    'UPDATE recipes SET is_active = 0 WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting recipe' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      res.json({ message: 'Recipe deleted successfully' });
    }
  );
});

module.exports = router;
