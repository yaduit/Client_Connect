import { useSearchParams, Link } from "react-router-dom";
import SignupForm from "../../components/auth/signupForm";

const SignupPage = () => {
  const [params] = useSearchParams();
  const redirect = params.get("redirect");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-gray-600">
            Join Client Connect in minutes
          </p>
        </div>

        <SignupForm />

        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to={`/login${redirect ? `?redirect=${redirect}` : ""}`}
            className="text-green-600 font-semibold hover:text-green-700 hover:underline transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;