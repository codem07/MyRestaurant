import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import RecipeManagement from "pages/recipe-management";
import ReportsAnalytics from "pages/reports-analytics";
import OrderManagement from "pages/order-management";
import TableManagement from "pages/table-management";
import InventoryManagement from "pages/inventory-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<RecipeManagement />} />
        <Route path="/recipe-management" element={<RecipeManagement />} />
        <Route path="/reports-analytics" element={<ReportsAnalytics />} />
        <Route path="/order-management" element={<OrderManagement />} />
        <Route path="/table-management" element={<TableManagement />} />
        <Route path="/inventory-management" element={<InventoryManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;