import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SignupApi } from "../../api/auth.api.js";
import { User, Mail, Lock, UserCircle, Briefcase } from "lucide-react";

const SignupForm = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker", // ✅ Default to seeker
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await SignupApi(form);

      // ✅ After signup → go to login with redirect preserved
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`, {
        replace: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="password"
            type="password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          I'm signing up as
        </label>
        <div className="grid grid-cols-2 gap-3">
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
              onChange={(e) => setForm({ ...form, role: e.target.value })}
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
              onChange={(e) => setForm({ ...form, role: e.target.value })}
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
};

export default SignupForm;