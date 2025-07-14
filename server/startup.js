
const db = require('./database/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const createSampleData = async () => {
  console.log('Creating sample data...');
  
  try {
    // Create sample user (for testing)
    const hashedPassword = await bcrypt.hash('password123', 12);
    const userId = uuidv4();
    const subscriptionExpiresAt = new Date();
    subscriptionExpiresAt.setDate(subscriptionExpiresAt.getDate() + 30);

    // Check if demo user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', ['demo@recipemaster.com'], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    let actualUserId = userId;
    if (!existingUser) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO users (id, email, password, first_name, last_name, restaurant_name, subscription_expires_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [userId, 'demo@recipemaster.com', hashedPassword, 'Demo', 'User', 'Demo Restaurant', subscriptionExpiresAt.toISOString()], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log('Demo user created successfully');
    } else {
      actualUserId = existingUser.id;
      console.log('Demo user already exists');
    }

  // Create sample tables
    const tableIds = [];
    for (let i = 1; i <= 10; i++) {
      const tableId = uuidv4();
      tableIds.push(tableId);
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO tables (id, user_id, table_number, capacity, x_position, y_position)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [tableId, actualUserId, i, Math.floor(Math.random() * 4) + 2, (i - 1) * 100, 100], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    }

  // Create sample inventory items
  const inventoryItems = [
    { name: 'Tomatoes', category: 'Vegetables', currentStock: 50, unit: 'kg', minStock: 10, costPerUnit: 2.5 },
    { name: 'Chicken Breast', category: 'Meat', currentStock: 25, unit: 'kg', minStock: 5, costPerUnit: 12.0 },
    { name: 'Pasta', category: 'Dry Goods', currentStock: 100, unit: 'kg', minStock: 20, costPerUnit: 1.5 },
    { name: 'Olive Oil', category: 'Oils', currentStock: 15, unit: 'liters', minStock: 5, costPerUnit: 8.0 },
    { name: 'Cheese', category: 'Dairy', currentStock: 8, unit: 'kg', minStock: 3, costPerUnit: 15.0 }
  ];

  inventoryItems.forEach(item => {
    const itemId = uuidv4();
    db.run(`
      INSERT OR IGNORE INTO inventory (id, user_id, name, category, current_stock, unit, min_stock, cost_per_unit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [itemId, userId, item.name, item.category, item.currentStock, item.unit, item.minStock, item.costPerUnit]);
  });

  console.log('Sample data created successfully!');
    console.log('Demo login: demo@recipemaster.com / password123');
  } catch (error) {
    console.error('Error creating sample data:', error.message);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  createSampleData();
}

module.exports = { createSampleData };
