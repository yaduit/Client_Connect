import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignupApi } from "../../api/auth.api.js";
import { User, Mail, Lock, UserCircle, Briefcase, AlertCircle } from "lucide-react";

const SignupForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // ✅ NEW: Basic validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ NEW: Validate before submitting
    if (!validateForm()) {
      setError("Please fix the errors above");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      console.log("📝 Attempting signup with:", { 
        name: form.name, 
        email: form.email, 
        role: form.role 
      });

      await SignupApi(form);

      console.log("✅ Signup successful!");

      // ✅ FIXED: Role-based redirect
      let finalRedirect = "/";
      if (form.role === "provider") {
        finalRedirect = "/provider/dashboard";
      }

      navigate(`/login?redirect=${encodeURIComponent(finalRedirect)}`, {
        replace: true,
      });
    } catch (err) {
      console.error("❌ Signup Error:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        fullError: err
      });

      // ✅ NEW: Better error handling for different status codes
      if (err.response?.status === 409) {
        setError("This email is already registered. Please log in instead or use a different email.");
        setFieldErrors(prev => ({
          ...prev,
          email: "Email already exists"
        }));
      } else if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message;
        if (errorMessage?.includes("email")) {
          setError("Invalid email format. Please check and try again.");
          setFieldErrors(prev => ({
            ...prev,
            email: "Invalid email"
          }));
        } else {
          setError(errorMessage || "Invalid signup data. Please check your input.");
        }
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(
          err.response?.data?.message || 
          err.message || 
          "Signup failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // ✅ NEW: Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ✅ NEW: Error Alert with better styling */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleFieldChange}
            disabled={loading}
            required
            className={`w-full pl-11 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 ${
              fieldErrors.name ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
          />
        </div>
        {fieldErrors.name && (
          <p className="text-red-600 text-sm flex items-center gap-1">
            <span>•</span> {fieldErrors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="email"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleFieldChange}
            disabled={loading}
            required
            className={`w-full pl-11 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 ${
              fieldErrors.email ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
          />
        </div>
        {fieldErrors.email && (
          <p className="text-red-600 text-sm flex items-center gap-1">
            <span>•</span> {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleFieldChange}
            disabled={loading}
            required
            className={`w-full pl-11 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 ${
              fieldErrors.password ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
          />
        </div>
        {fieldErrors.password && (
          <p className="text-red-600 text-sm flex items-center gap-1">
            <span>•</span> {fieldErrors.password}
          </p>
        )}
        <p className="text-xs text-gray-500">
          Minimum 6 characters for security
        </p>
      </div>

      {/* Role Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          I'm signing up as
        </label>
        <div className="grid grid-cols-2 gap-3">
          {/* Seeker Option */}
          <label
            className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              form.role === "seeker"
                ? "border-green-600 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="seeker"
              checked={form.role === "seeker"}
              onChange={handleFieldChange}
              disabled={loading}
              className="sr-only"
            />
            <UserCircle
              className={`w-8 h-8 mb-2 ${
                form.role === "seeker" ? "text-green-600" : "text-gray-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                form.role === "seeker" ? "text-green-700" : "text-gray-700"
              }`}
            >
              Seeker
            </span>
          </label>

          {/* Provider Option */}
          <label
            className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              form.role === "provider"
                ? "border-green-600 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="provider"
              checked={form.role === "provider"}
              onChange={handleFieldChange}
              disabled={loading}
              className="sr-only"
            />
            <Briefcase
              className={`w-8 h-8 mb-2 ${
                form.role === "provider" ? "text-green-600" : "text-gray-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                form.role === "provider" ? "text-green-700" : "text-gray-700"
              }`}
            >
              Provider
            </span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>

      {/* ✅ NEW: Helpful hint for 409 error users */}
      {error?.includes("already registered") && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          <p className="font-medium mb-1">Already have an account?</p>
          <p>Try logging in with your email instead.</p>
        </div>
      )}
    </form>
  );
};

export default SignupForm;