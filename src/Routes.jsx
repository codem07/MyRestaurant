import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
// Add your imports here
import Login from "pages/auth/Login";
import Register from "pages/auth/Register";
import Dashboard from "pages/dashboard/Dashboard";
import RecipeManagement from "pages/recipe-management";
import ReportsAnalytics from "pages/reports-analytics";
import OrderManagement from "pages/order-management";
import TableManagement from "pages/table-management";
import InventoryManagement from "pages/inventory-management";
import KitchenInterface from "pages/kitchen-interface/KitchenInterface";
import SubscriptionPage from "pages/subscription/SubscriptionPage";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/recipe-management" element={
            <ProtectedRoute>
              <RecipeManagement />
            </ProtectedRoute>
          } />
          <Route path="/reports-analytics" element={
            <ProtectedRoute requiredPlan="basic">
              <ReportsAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/order-management" element={
            <ProtectedRoute>
              <OrderManagement />
            </ProtectedRoute>
          } />
          <Route path="/table-management" element={
            <ProtectedRoute>
              <TableManagement />
            </ProtectedRoute>
          } />
          <Route path="/inventory-management" element={
            <ProtectedRoute>
              <InventoryManagement />
            </ProtectedRoute>
          } />
          <Route path="/kitchen" element={
            <ProtectedRoute>
              <KitchenInterface />
            </ProtectedRoute>
          } />
          <Route path="/subscription" element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;