import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import { ThemeProvider } from './components/common/ThemeProvider';
import { CurrencyProvider } from './context/CurrencyContext';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PaymentStatusPage from './pages/PaymentStatusPage';
import AuthCallback from './pages/AuthCallback';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';
import OrderTrackingPage from './pages/OrderTrackingPage';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AddProduct from './pages/admin/AddProduct';
import AdminCoupons from './pages/admin/AdminCoupons';
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
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider>
      <CurrencyProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/payment-status" element={<PaymentStatusPage />} />

                {/* Google OAuth Callback - MUST be before protected routes */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/search" element={<SearchPage />} />
<Route path="/track-order" element={<OrderTrackingPage />} />
                {/* Auth Routes */}
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

                {/* Protected Routes - Require Login */}
                <Route path="/cart" element={
                  <ProtectedRoute requireAuth={true}>
                    <CartPage />
                  </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute requireAuth={true}>
                    <WishlistPage />
                  </ProtectedRoute>
                } />
                <Route path="/tracking/:orderId" element={
  <ProtectedRoute requireAuth={true}>
    <OrderTrackingPage />
  </ProtectedRoute>
} />
                <Route path="/checkout" element={
                  <ProtectedRoute requireAuth={true}>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute requireAuth={true}>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute requireAuth={true}>
                    <OrdersPage />
                  </ProtectedRoute>
                } />
                <Route path="/orders/:id" element={
                  <ProtectedRoute requireAuth={true}>
                    <OrderDetailsPage />
                  </ProtectedRoute>
                } />


                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAuth={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AddProduct />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                </Route>
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