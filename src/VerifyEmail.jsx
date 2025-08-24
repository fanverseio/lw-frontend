import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function VerifyEmail({ pendingEmail }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/verify-email`,
        {
          email: pendingEmail,
          code: code,
        }
      );
      if (response.data.result && response.data.result.message) {
        setSuccess("Email verified successfully!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during verification.");
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <p className="mb-4">
        Enter the OTP sent to <b>{pendingEmail}</b>
      </p>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          placeholder="Enter OTP code"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Verify
        </button>
      </form>
    </div>
  );
}

export default VerifyEmail;
