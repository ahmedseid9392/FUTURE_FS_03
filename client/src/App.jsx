import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import { ThemeProvider } from './components/common/ThemeProvider';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { CurrencyProvider } from './context/CurrencyContext';

import AuthCallback from './pages/AuthCallback';

// Pages (to be created)
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
 import ProductPage from './pages/ProductPage';
 import CartPage from './pages/CartPage';
 import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
// import OrdersPage from './pages/OrdersPage';
// import AboutPage from './pages/AboutPage';
// import ContactPage from './pages/ContactPage';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AddProduct from './pages/admin/AddProduct';
import AdminSettings from './pages/admin/AdminSettings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
   const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    // Check authentication on app load
    checkAuth();
  }, [checkAuth]);
  
  return (
    <ThemeProvider>
        <CurrencyProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path="/admin" element={
  <ProtectedRoute requireAuth={true}>
    <AdminLayout />
  </ProtectedRoute>
}>
  <Route path="products/new" element={<AddProduct />} />
  <Route index element={<AdminDashboard />} />
  <Route path="products" element={<AdminProducts />} />
  <Route path="orders" element={<AdminOrders />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="settings" element={<AdminSettings />} />
</Route>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
               <Route path="/product/:id" element={<ProductPage />} />
                      {/* Protected Routes - Require Login */}
                <Route path="/cart" element={
                  <ProtectedRoute requireAuth={true}>
                    <CartPage />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute requireAuth={true}>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />

               {/* Auth Routes - Redirect if already logged in */}
                <Route path="/login" element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginPage />
                  </ProtectedRoute>
                } />
                <Route path="/register" element={
                  <ProtectedRoute requireAuth={false}>
                    <RegisterPage />
                  </ProtectedRoute>
                } />
               <Route path="/profile" element={
                  <ProtectedRoute requireAuth={true}>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                {/* <Route path="/orders" element={
                  <ProtectedRoute requireAuth={true}>
                    <OrdersPage />
                  </ProtectedRoute>
                } />  */}
              {/* <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />  */}
            </Routes>
          </Layout>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;