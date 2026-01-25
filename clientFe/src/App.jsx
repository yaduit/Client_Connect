import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/navbar.jsx";
import HomePage from "./pages/homePage.jsx";
import SearchPage from "./pages/searchPage.jsx";
import CategoryPage from "./pages/categoryPage.jsx";
import ProviderDetailsPage from "./pages/provider/providerDetailsPage.jsx";

import LoginPage from "./pages/auth/loginPage.jsx";
import SignupPage from "./pages/auth/signupPage.jsx";

import ProviderOnboarding from "./pages/provider/providerOnboarding.jsx";
import ProviderDashBoard from "./pages/provider/providerDashBoard.jsx";

import ProtectedRoute from "./routes/protectedRoutes.jsx";

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/categories/:categorySlug" element={<CategoryPage />} />
      <Route path="/providers/:id" element={<ProviderDetailsPage />} />

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
    </Routes>
    </>
  );
}

export default App;
