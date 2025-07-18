"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Icon from './AppIcon';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPlan?: 'free' | 'basic' | 'pro' | 'enterprise';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPlan = 'free' }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.replace('/auth/login');
    return null;
  }

  // Check subscription level
  const planHierarchy = { 'free': 0, 'basic': 1, 'pro': 2, 'enterprise': 3 };
  const userPlanLevel = planHierarchy[(user?.subscriptionPlan as keyof typeof planHierarchy) ?? 'free'] || 0;
  const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

  if (userPlanLevel < requiredPlanLevel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
            <Icon name="Lock" size={48} className="mx-auto mb-4 text-warning" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Upgrade Required</h1>
            <p className="text-muted-foreground mb-6">
              This feature requires a {requiredPlan} plan or higher. Your current plan is {user?.subscriptionPlan}.
            </p>
            <button 
              onClick={() => router.push('/subscription')}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 