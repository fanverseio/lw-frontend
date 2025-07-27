import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        { email }
      );
      setMessage("Check your email for reset instructions.");

      setTimeout(() => {
        navigate("/");
      }, 3000);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Reset Password</h1>
      <p className="text-gray-600 mb-4">
        Enter your email to receive a password reset link
      </p>

      {error && <div className="text-red-500 mb-2">{error}</div>}
      {message && <div className="text-green-500 mb-2">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <button
        className="mt-4 text-blue-500 hover:underline"
        onClick={() => navigate("/")}
      >
        Back to Login
      </button>
    </div>
  );
}
export default ForgotPassword;
