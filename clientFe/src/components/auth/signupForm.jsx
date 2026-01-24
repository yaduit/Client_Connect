import { useState } from "react";

const SignupForm = ({ redirect }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("seeker");

  const handleSubmit = (e) => {
    e.preventDefault();

    // TEMP – backend wiring comes next
    console.log("Signup submit", {
      name,
      email,
      password,
      role,
      redirect,
    });

    // later:
    // 1. POST /auth/signup
    // 2. auto-login
    // 3. redirect
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        required
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="email"
        required
        placeholder="Email address"
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

      {/* Role selection */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          I want to
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="seeker">Find services</option>
          <option value="provider">Offer services</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700"
      >
        Create account
      </button>
    </form>
  );
};

export default SignupForm;
