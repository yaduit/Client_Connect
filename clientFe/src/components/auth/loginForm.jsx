import { useState } from "react";
import OAuthButton from "./oAuthButton";
const LoginForm = ({ redirect }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // TEMP
    console.log("Login submit", { email, password, redirect });

    // later:
    // 1. call backend
    // 2. store token
    // 3. navigate(redirect || "/")
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="password"
        required
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700"
      >
        Login
      </button>
      <OAuthButton/>
    </form>
  );
};

export default LoginForm;
