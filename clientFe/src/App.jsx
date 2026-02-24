import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage.jsx";
import SearchPage from "./pages/searchPage.jsx";
import CategoryPage from "./pages/categoryPage.jsx";
import ProviderDetailsPage from "./pages/provider/providerDetailsPage.jsx";

import LoginPage from "./pages/auth/loginPage.jsx";
import SignupPage from "./pages/auth/signupPage.jsx";
import WriteReviewPage from "./pages/auth/writeReviewPage.jsx";

import ProviderOnboarding from "./pages/provider/providerOnboarding.jsx";
import ProviderDashBoard from "./pages/provider/providerDashBoard.jsx";
import ProtectedRoute from "./routes/protectedRoutes.jsx";

import AdminDashboard from "./pages/admin/adminDashboard.jsx";
import AdminUsers from "./pages/admin/adminUsers.jsx";
import AdminProviders from "./pages/admin/adminProviders.jsx";
import AdminBookings from "./pages/admin/adminBookings.jsx";
import AdminCategories from "./pages/admin/adminCategories.jsx";

function App() {
  return (
    <>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/categories/:categorySlug" element={<CategoryPage />} />
      <Route path="/providers/:id" element={<ProviderDetailsPage />} />

      {/* Review routes */}
      <Route
        path="/write-review"
        element={
          <ProtectedRoute requiredRole="seeker">
            <WriteReviewPage />
          </ProtectedRoute>
        }
      />

      {/* Provider routes */}
      <Route
        path="/provider/onboarding"
        element={
          <ProtectedRoute requiredRole="provider" allowSeeker={true}>
            <ProviderOnboarding />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider/dashboard"
        element={
          <ProtectedRoute requiredRole="provider">
            <ProviderDashBoard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/providers"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProviders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminCategories />
            </ProtectedRoute>
          }
        />
    </Routes>
    </>
  );
}

export default App;
