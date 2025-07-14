
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../context/AuthContext';
import MainSidebar from '../../components/ui/MainSidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import axios from 'axios';

const SubscriptionPage = () => {
  const { user, updateUser } = useAuth();
  const [plans, setPlans] = useState({});
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const [plansResponse, currentResponse, usageResponse] = await Promise.all([
        axios.get('/subscriptions/plans'),
        axios.get('/subscriptions/current'),
        axios.get('/subscriptions/usage')
      ]);

      setPlans(plansResponse.data);
      setCurrentSubscription(currentResponse.data);
      setUsage(usageResponse.data);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planKey) => {
    setUpgrading(true);
    try {
      const response = await axios.post('/subscriptions/upgrade', { plan: planKey });
      
      // Update user context
      updateUser({
        subscriptionPlan: planKey,
        subscriptionExpiresAt: response.data.expiresAt
      });

      // Refresh subscription data
      await fetchSubscriptionData();
      
      alert('Subscription upgraded successfully!');
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to upgrade subscription. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Subscription - RecipeMaster</title>
        <meta name="description" content="Manage your RecipeMaster subscription" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <MainSidebar />
        
        <div className="ml-sidebar">
          <div className="px-6 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Subscription</h1>
              <p className="text-muted-foreground mt-2">
                Manage your subscription and view usage statistics
              </p>
            </div>

            {/* Current Subscription */}
            <div className="bg-card rounded-lg border border-border p-6 mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Current Plan</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    {plans[currentSubscription?.plan]?.name || 'Free Trial'}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentSubscription?.expiresAt ? 
                      `Expires: ${new Date(currentSubscription.expiresAt).toLocaleDateString()}` :
                      'No expiration'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    ${plans[currentSubscription?.plan]?.price || 0}/month
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    currentSubscription?.status === 'active' ? 
                      'bg-success/10 text-success' : 
                      'bg-error/10 text-error'
                  }`}>
                    {currentSubscription?.status || 'inactive'}
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            {usage && (
              <div className="bg-card rounded-lg border border-border p-6 mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Usage Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {usage.recipes.used}
                      {!usage.recipes.unlimited && ` / ${usage.recipes.limit}`}
                    </div>
                    <p className="text-muted-foreground">Recipes</p>
                    {!usage.recipes.unlimited && (
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min((usage.recipes.used / usage.recipes.limit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {usage.tables.used}
                      {!usage.tables.unlimited && ` / ${usage.tables.limit}`}
                    </div>
                    <p className="text-muted-foreground">Tables</p>
                    {!usage.tables.unlimited && (
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min((usage.tables.used / usage.tables.limit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {usage.orders.used}
                      {!usage.orders.unlimited && ` / ${usage.orders.limit}`}
                    </div>
                    <p className="text-muted-foreground">Orders (30 days)</p>
                    {!usage.orders.unlimited && (
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min((usage.orders.used / usage.orders.limit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Available Plans */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Available Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(plans).map(([planKey, plan]) => (
                  <div 
                    key={planKey}
                    className={`bg-card rounded-lg border p-6 relative ${
                      currentSubscription?.plan === planKey ? 
                        'border-primary ring-2 ring-primary/20' : 
                        'border-border'
                    }`}
                  >
                    {currentSubscription?.plan === planKey && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                          Current Plan
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                      <div className="text-3xl font-bold text-foreground mt-2">
                        ${plan.price}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-foreground">
                          <Icon name="Check" size={16} className="text-success mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      variant={currentSubscription?.plan === planKey ? "outline" : "default"}
                      className="w-full"
                      disabled={currentSubscription?.plan === planKey || upgrading}
                      onClick={() => handleUpgrade(planKey)}
                    >
                      {upgrading ? (
                        <Icon name="Loader2" size={16} className="animate-spin" />
                      ) : currentSubscription?.plan === planKey ? (
                        'Current Plan'
                      ) : (
                        'Upgrade'
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
