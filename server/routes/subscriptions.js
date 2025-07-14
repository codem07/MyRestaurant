
const express = require('express');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free Trial',
    price: 0,
    features: ['Up to 50 recipes', 'Basic inventory tracking', '1 restaurant location'],
    limits: { recipes: 50, tables: 10, orders: 100 }
  },
  basic: {
    name: 'Basic Plan',
    price: 29,
    features: ['Up to 200 recipes', 'Advanced inventory', 'Order analytics', 'Email support'],
    limits: { recipes: 200, tables: 25, orders: 1000 }
  },
  pro: {
    name: 'Pro Plan',
    price: 79,
    features: ['Unlimited recipes', 'Multi-location support', 'Advanced analytics', 'Priority support'],
    limits: { recipes: -1, tables: 100, orders: -1 }
  },
  enterprise: {
    name: 'Enterprise Plan',
    price: 199,
    features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'Custom features'],
    limits: { recipes: -1, tables: -1, orders: -1 }
  }
};

// Get subscription plans
router.get('/plans', (req, res) => {
  res.json(SUBSCRIPTION_PLANS);
});

// Get current subscription
router.get('/current', authenticateToken, (req, res) => {
  const user = req.user;
  const currentPlan = SUBSCRIPTION_PLANS[user.subscription_plan] || SUBSCRIPTION_PLANS.free;
  
  res.json({
    plan: user.subscription_plan,
    status: user.subscription_status,
    expiresAt: user.subscription_expires_at,
    planDetails: currentPlan
  });
});

// Upgrade subscription (simplified for demo)
router.post('/upgrade', authenticateToken, (req, res) => {
  const { plan } = req.body;
  
  if (!SUBSCRIPTION_PLANS[plan]) {
    return res.status(400).json({ message: 'Invalid subscription plan' });
  }

  // In production, integrate with payment processor like Stripe
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

  db.run(
    'UPDATE users SET subscription_plan = ?, subscription_status = "active", subscription_expires_at = ? WHERE id = ?',
    [plan, expiresAt.toISOString(), req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating subscription' });
      }

      res.json({
        message: 'Subscription updated successfully',
        plan,
        expiresAt: expiresAt.toISOString()
      });
    }
  );
});

// Check usage limits
router.get('/usage', authenticateToken, (req, res) => {
  const queries = [
    'SELECT COUNT(*) as count FROM recipes WHERE user_id = ? AND is_active = 1',
    'SELECT COUNT(*) as count FROM tables WHERE user_id = ?',
    'SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND DATE(created_at) >= DATE("now", "-30 days")'
  ];

  Promise.all(queries.map(query => {
    return new Promise((resolve, reject) => {
      db.get(query, [req.user.id], (err, result) => {
        if (err) reject(err);
        else resolve(result.count);
      });
    });
  })).then(results => {
    const currentPlan = SUBSCRIPTION_PLANS[req.user.subscription_plan] || SUBSCRIPTION_PLANS.free;
    
    res.json({
      recipes: {
        used: results[0],
        limit: currentPlan.limits.recipes,
        unlimited: currentPlan.limits.recipes === -1
      },
      tables: {
        used: results[1],
        limit: currentPlan.limits.tables,
        unlimited: currentPlan.limits.tables === -1
      },
      orders: {
        used: results[2],
        limit: currentPlan.limits.orders,
        unlimited: currentPlan.limits.orders === -1
      }
    });
  }).catch(err => {
    res.status(500).json({ message: 'Error fetching usage data' });
  });
});

module.exports = router;
