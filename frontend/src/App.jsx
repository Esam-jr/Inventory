import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CssBaseline, Box } from "@mui/material";
import { AppThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import LoginForm from "./components/auth/LoginForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import ItemList from "./pages/Inventory/ItemList";
import RequisitionList from "./pages/Requisitions/RequisitionList";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoadingSpinner from "./components/ui/LoadingSpinner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <LoadingSpinner message="Initializing application..." />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginForm /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/inventory" element={<ItemList />} />
                  <Route path="/requisitions" element={<RequisitionList />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="*" element={<div>Page not found</div>} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <CssBaseline />
          <AppContent />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
