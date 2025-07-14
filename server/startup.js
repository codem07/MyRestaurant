
const bcrypt = require('bcryptjs');
const prisma = require('./database/prisma');

const createSampleData = async () => {
  console.log('Creating sample data...');
  
  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@recipemaster.com' }
    });

    let userId;
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const subscriptionExpiresAt = new Date();
      subscriptionExpiresAt.setDate(subscriptionExpiresAt.getDate() + 30);

      const user = await prisma.user.create({
        data: {
          email: 'demo@recipemaster.com',
          password: hashedPassword,
          firstName: 'Demo',
          lastName: 'User',
          restaurantName: 'Demo Restaurant',
          subscriptionExpiresAt
        }
      });

      userId = user.id;
      console.log('Demo user created successfully');
    } else {
      userId = existingUser.id;
      console.log('Demo user already exists');
    }

    // Create sample recipes
    const existingRecipes = await prisma.recipe.findMany({
      where: { userId }
    });

    if (existingRecipes.length === 0) {
      await prisma.recipe.createMany({
        data: [
          {
            userId,
            name: 'Butter Chicken',
            description: 'Creamy tomato-based curry with tender chicken pieces',
            category: 'main-course',
            prepTime: 30,
            cookTime: 45,
            servings: 4,
            difficulty: 'medium',
            costPerServing: 150,
            instructions: JSON.stringify([
              { id: 1, instruction: 'Marinate chicken in yogurt and spices for 30 minutes', timer: 30 },
              { id: 2, instruction: 'Cook chicken in a pan until golden brown', timer: 15 },
              { id: 3, instruction: 'Prepare tomato-based sauce with cream', timer: 20 },
              { id: 4, instruction: 'Combine chicken with sauce and simmer', timer: 10 }
            ]),
            ingredients: JSON.stringify([
              { name: 'Chicken', quantity: 500, unit: 'grams' },
              { name: 'Tomatoes', quantity: 400, unit: 'grams' },
              { name: 'Cream', quantity: 200, unit: 'ml' },
              { name: 'Spices', quantity: 1, unit: 'set' }
            ])
          },
          {
            userId,
            name: 'Masala Dosa',
            description: 'Crispy South Indian crepe with spiced potato filling',
            category: 'main-course',
            prepTime: 480,
            cookTime: 30,
            servings: 4,
            difficulty: 'hard',
            costPerServing: 80,
            instructions: JSON.stringify([
              { id: 1, instruction: 'Soak rice and dal for 4-6 hours', timer: 360 },
              { id: 2, instruction: 'Grind and ferment batter overnight', timer: 480 },
              { id: 3, instruction: 'Prepare potato masala', timer: 20 },
              { id: 4, instruction: 'Make crispy dosa and add filling', timer: 10 }
            ]),
            ingredients: JSON.stringify([
              { name: 'Rice', quantity: 300, unit: 'grams' },
              { name: 'Urad Dal', quantity: 100, unit: 'grams' },
              { name: 'Potatoes', quantity: 500, unit: 'grams' },
              { name: 'Spices', quantity: 1, unit: 'set' }
            ])
          }
        ]
      });
      console.log('Sample recipes created');
    }

    // Create sample inventory
    const existingInventory = await prisma.inventory.findMany({
      where: { userId }
    });

    if (existingInventory.length === 0) {
      await prisma.inventory.createMany({
        data: [
          {
            userId,
            name: 'Chicken Breast',
            category: 'meat',
            currentStock: 5,
            unit: 'kg',
            minStock: 2,
            costPerUnit: 300,
            supplier: 'Premium Meats'
          },
          {
            userId,
            name: 'Basmati Rice',
            category: 'grains',
            currentStock: 25,
            unit: 'kg',
            minStock: 10,
            costPerUnit: 120,
            supplier: 'Grain Suppliers Ltd'
          },
          {
            userId,
            name: 'Tomatoes',
            category: 'vegetables',
            currentStock: 8,
            unit: 'kg',
            minStock: 5,
            costPerUnit: 40,
            supplier: 'Fresh Vegetables Co'
          }
        ]
      });
      console.log('Sample inventory created');
    }

    // Create sample tables
    const existingTables = await prisma.table.findMany({
      where: { userId }
    });

    if (existingTables.length === 0) {
      await prisma.table.createMany({
        data: [
          { userId, tableNumber: 1, capacity: 2, status: 'available' },
          { userId, tableNumber: 2, capacity: 4, status: 'available' },
          { userId, tableNumber: 3, capacity: 6, status: 'available' },
          { userId, tableNumber: 4, capacity: 2, status: 'available' },
          { userId, tableNumber: 5, capacity: 4, status: 'available' }
        ]
      });
      console.log('Sample tables created');
    }

    console.log('Sample data created successfully!');
    console.log('Demo login: demo@recipemaster.com / password123');

  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
};

module.exports = { createSampleData };
