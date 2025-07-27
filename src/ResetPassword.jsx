import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract email and token from URL parameters
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    // Check if email and token are present in URL
    if (!email || !token) {
      setError("Invalid or missing reset link parameters.");
    }
  }, [email, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check password length (adjust as needed)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/reset-password",
        {
          email: email,
          token: token,
          newPassword: password,
        }
      );

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Set New Password
      </h1>
      <p className="text-gray-600 mb-4">Enter your new password</p>

      {error && <div className="text-red-500 mb-2">{error}</div>}
      {message && <div className="text-green-500 mb-2">{message}</div>}

      {email && token ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      ) : (
        <p className="text-red-500">Invalid reset link.</p>
      )}

      <button
        className="mt-4 text-blue-500 hover:underline"
        onClick={() => navigate("/")}
      >
        Back to Login
      </button>
    </div>
  );
}

export default ResetPassword;
