import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth.js";
import { LoginApi } from "../../api/auth.api.js";
import OAuthButton from "./oAuthButton.jsx";

const LoginForm = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";

  const { login } = useAuth(); // ✅ THIS IS REQUIRED

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await LoginApi(form);

      // ✅ Update global auth state
      login({
        token: data.token,
        user: data.user,
      });

      navigate(redirect, { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-600">{error}</p>}

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

      <button disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <OAuthButton/>
    </form>
  );
};

export default LoginForm;
