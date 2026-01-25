import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SignupApi } from "../../api/auth.api.js";

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
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-600">{error}</p>}

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What are you signing up as?
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="seeker"
              checked={form.role === "seeker"}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mr-2"
            />
            <span className="text-gray-700">Seeker</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="provider"
              checked={form.role === "provider"}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mr-2"
            />
            <span className="text-gray-700">Provider</span>
          </label>
        </div>
      </div>

      <button disabled={loading}>
        {loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
};

export default SignupForm;
