import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ShoppingCartProvider } from './contexts/ShoppingCartContext';
import { AuthProvider } from './contexts/AuthContext';
import MercadoPagoHandler from './components/MercadoPagoHandler';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ShippingPage from './pages/ShippingPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentPendingPage from './pages/PaymentPendingPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ResumeOrderPage from './pages/ResumeOrderPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminNotificationPage from './pages/admin/AdminNotificationPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ShoppingCartProvider>
        <Router future={{ 
          v7_startTransition: true ,
          v7_relativeSplatPath: true
        }}>
          <MercadoPagoHandler />
          <Toaster position="top-center" />
          <Routes>
            {/* Public and User Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />              <Route path="about" element={<AboutPage />} />              <Route path="contact" element={<ContactPage />} />              <Route path="faq" element={<FAQPage />} />
              <Route path="shipping" element={<ShippingPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />              <Route path="order-confirmation/:id" element={<OrderConfirmationPage />} />              <Route path="pago-exitoso" element={<PaymentSuccessPage />} />
              <Route path="pago-fallido" element={<PaymentFailedPage />} />
              <Route path="pago-pendiente" element={<PaymentPendingPage />} />
              <Route path="register/pago-exitoso" element={<PaymentSuccessPage />} />
              <Route path="register/pago-fallido" element={<PaymentFailedPage />} />
              <Route path="register/pago-pendiente" element={<PaymentPendingPage />} />              <Route path="checkout/resume/:orderId" element={
                <ProtectedRoute>
                  <ResumeOrderPage />
                </ProtectedRoute>
              } />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="auth/callback" element={<AuthCallbackPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              {/* Catch-all for user-facing 404 */}
              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              {/* Default admin page could be a dashboard or notifications */}
              <Route index element={<AdminNotificationPage />} /> 
              <Route path="notifications" element={<AdminNotificationPage />} />
              {/* Add other admin routes here, e.g., users, settings */}
            </Route>
            
            {/* Global Catch-all for 404 - Make sure this is last */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ShoppingCartProvider>
    </AuthProvider>
  );
}

export default App;