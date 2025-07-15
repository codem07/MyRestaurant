"use client";

import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import MainSidebar from "@/components/ui/MainSidebar";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: usage } = useApi("/subscriptions/usage");

  const quickActions = [
    {
      title: "Create Recipe",
      description: "Add a new recipe to your collection",
      icon: "ChefHat",
      link: "/recipe-management",
      color: "bg-primary", // orange theme
    },
    {
      title: "Take Order",
      description: "Create a new customer order",
      icon: "ShoppingCart",
      link: "/order-management",
      color: "bg-green-500",
    },
    {
      title: "Manage Tables",
      description: "View and update table status",
      icon: "Grid3x3",
      link: "/table-management",
      color: "bg-purple-500",
    },
    {
      title: "Check Inventory",
      description: "Monitor stock levels and alerts",
      icon: "Package",
      link: "/inventory-management",
      color: "bg-orange-500",
    },
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      <Head>
        <title>Dashboard - RecipeMaster</title>
        <meta name="description" content="Restaurant management dashboard" />
      </Head>

      <div className="min-h-screen bg-background">
        <MainSidebar />
        <div className="ml-sidebar px-6 sm:px-4 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">
              {getTimeOfDay()}, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome to RecipeMaster. Here's what's happening today.
            </p>
          </div>

          {/* Subscription Alert */}
          {user?.subscriptionPlan === "free" && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8">
              <div className="flex items-start space-x-3">
                <Icon name="Star" size={20} className="text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Free Trial Active</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're currently on the free trial. Upgrade to unlock more features and remove limits.
                  </p>
                  <Link href="/subscription" legacyBehavior>
                    <a>
                      <Button size="sm" className="mt-3">
                        View Plans
                      </Button>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.link}
                  legacyBehavior
                >
                  <a className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/20 flex flex-col items-center text-center">
                    <div
                      className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon name={action.icon as any} size={24} color="white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </a>
                </Link>
              ))}
            </div>
          </div>

          {/* Usage Overview */}
          {usage && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Usage Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon name="Book" size={24} className="text-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      {usage.recipes.unlimited
                        ? "Unlimited"
                        : `${usage.recipes.used}/${usage.recipes.limit}`}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">Recipes</h3>
                  <p className="text-sm text-muted-foreground">Active recipes in your collection</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon name="Grid3x3" size={24} className="text-purple-500" />
                    <span className="text-sm text-muted-foreground">
                      {usage.tables.unlimited
                        ? "Unlimited"
                        : `${usage.tables.used}/${usage.tables.limit}`}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">Tables</h3>
                  <p className="text-sm text-muted-foreground">Tables in your restaurant</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon name="ShoppingCart" size={24} className="text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      {usage.orders.unlimited
                        ? "Unlimited"
                        : `${usage.orders.used}/${usage.orders.limit}`}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">Orders</h3>
                  <p className="text-sm text-muted-foreground">Orders this month</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Placeholder */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Icon name="Plus" size={16} className="text-primary" />
                <span className="text-sm text-foreground">Welcome to RecipeMaster! Start by creating your first recipe.</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Icon name="Settings" size={16} className="text-primary" />
                <span className="text-sm text-foreground">Set up your restaurant tables and floor plan.</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Icon name="Package" size={16} className="text-primary" />
                <span className="text-sm text-foreground">Add your inventory items to track stock levels.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 