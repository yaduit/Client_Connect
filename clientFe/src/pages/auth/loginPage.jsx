import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/loginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back
        </h1>
        <p className="text-gray-600 mb-6">
          Login to continue
        </p>

        <LoginForm />

        <p className="text-sm text-gray-600 mt-6 text-center">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
