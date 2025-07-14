
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Check if user still exists and subscription is active
    db.get(
      'SELECT * FROM users WHERE id = ? AND subscription_status = "active"',
      [user.id],
      (err, userRecord) => {
        if (err || !userRecord) {
          return res.status(403).json({ message: 'User not found or subscription inactive' });
        }

        // Check subscription expiry
        if (userRecord.subscription_expires_at && new Date(userRecord.subscription_expires_at) < new Date()) {
          return res.status(403).json({ message: 'Subscription expired' });
        }

        req.user = userRecord;
        next();
      }
    );
  });
};

const checkSubscription = (requiredPlan = 'free') => {
  return (req, res, next) => {
    const planHierarchy = { 'free': 0, 'basic': 1, 'pro': 2, 'enterprise': 3 };
    const userPlanLevel = planHierarchy[req.user.subscription_plan] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

    if (userPlanLevel < requiredPlanLevel) {
      return res.status(402).json({ 
        message: 'Upgrade required', 
        currentPlan: req.user.subscription_plan,
        requiredPlan 
      });
    }

    next();
  };
};

module.exports = { authenticateToken, checkSubscription };
