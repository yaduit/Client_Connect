import { useSearchParams, Link } from "react-router-dom";
import SignupForm from "../../components/auth/signupForm";

const SignupPage = () => {
  const [params] = useSearchParams();
  const redirect = params.get("redirect");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create your account
        </h1>
        <p className="text-gray-600 mb-6">
          Join Client Connect in minutes
        </p>

        <SignupForm redirect={redirect} />

        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to={`/login${redirect ? `?redirect=${redirect}` : ""}`}
            className="text-green-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
