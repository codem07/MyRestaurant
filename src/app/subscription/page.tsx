'use client';
import React from 'react';

const SubscriptionPage: React.FC = () => {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Subscription</h1>
      <p className="mb-4">Manage your subscription plan and billing details here.</p>
      {/* Add subscription management UI here */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-2">Current Plan: <span className="font-semibold">Pro</span></div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Upgrade Plan</button>
      </div>
    </div>
  );
};

export default SubscriptionPage; 