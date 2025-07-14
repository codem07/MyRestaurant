const express = require('express');
const prisma = require('../database/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get subscription status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true
      }
    });

    res.json({ subscription: user });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ message: 'Error fetching subscription' });
  }
});

// Update subscription
router.put('/plan', authenticateToken, async (req, res) => {
  const { plan } = req.body;

  try {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1); // Add 1 month

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        subscriptionPlan: plan,
        subscriptionStatus: 'active',
        subscriptionExpiresAt: expirationDate
      },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true
      }
    });

    res.json({ 
      message: 'Subscription updated successfully', 
      subscription: updatedUser 
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ message: 'Error updating subscription' });
  }
});

module.exports = router;