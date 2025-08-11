import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import UserDashboard from "./UserDashboard";
import axios from "axios";
import VerifyEmail from "./VerifyEmail";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

import PathEditor from "./components/PathEditor";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [pendingEmail, setPendingEmail] = useState("");

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AuthPage setToken={setToken} setPendingEmail={setPendingEmail} />
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute token={token}>
              <UserDashboard token={token} logout={logout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify-email"
          element={<VerifyEmail pendingEmail={pendingEmail} />}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/path/:id/editor" element={<PathEditor />} />
      </Routes>
    </Router>
  );
}

function AuthPage({ setToken, setPendingEmail }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState("");
  const [showResetButton, setShowResetButton] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [showForgotPasswordLink, setShowForgotPasswordLink] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowResetButton(false);
    setShowResendButton(false);
    setShowForgotPasswordLink(false);

    if (isSignIn) {
      //signing in
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          {
            email,
            password,
          }
        );

        if (response.data.token) {
          localStorage.setItem("token", response.data.token); //
          setToken(response.data.token);
          navigate("/dashboard");
        } else {
          setError("Authentication failed. Please try again.");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          const errorMessage = error.response.data.error;
          setError(errorMessage);
          if (errorMessage === "Invalid password") {
            setShowForgotPasswordLink(true);
          }
        }
      }
    } else {
      //signing up
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/register",
          {
            email,
            password,
          }
        );

        if (response.data.user) {
          setPendingEmail(email);
          navigate("/verify-email");
        } else {
          setError("Registration failed. Please try again.");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          const errorMessage = error.response.data.error;

          if (errorMessage === "Email already registered and verified") {
            setError(errorMessage);
            setShowResetButton(true);
          } else if (
            errorMessage === "Email already registered but not yet verified"
          ) {
            setPendingEmail(email);
            setError("Email already registered but not yet verified.");
            setShowResendButton(true);
          } else {
            setError("Something has gone wrong during registration.");
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-20 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Learner Weave</h1>
      <h2 className="font-light text-gray-800 mb-4">
        {isSignIn ? "Sign In" : "Sign Up"}
      </h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {showForgotPasswordLink && (
        <button
          className="mt-2 text-blue-500 hover:underline text-sm"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot your password?
        </button>
      )}
      {showResetButton && (
        <button
          className="mt-4 text-blue-500 hover:underline"
          onClick={() => navigate("/forgot-password")}
        >
          Reset Password
        </button>
      )}
      {showResendButton && (
        <button
          className="mt-4 text-blue-500 hover:underline"
          onClick={() => {
            navigate("/verify-email");
          }}
        >
          {" "}
          Resend Verification Email
        </button>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          {isSignIn ? "Login" : "Register"}
        </button>
      </form>
      <button
        className="mt-4 text-blue-500 hover:underline"
        onClick={() => {
          setIsSignIn((prev) => !prev);
          setError("");
          setShowResetButton(false);
          setShowResendButton(false);
          setShowForgotPasswordLink(false);
        }}
        type="button"
      >
        {isSignIn
          ? "Don't have an account? Sign Up"
          : "Already have an account? Sign In"}
      </button>
      <button
        className="mt-4 flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded w-full shadow"
        type="button"
        onClick={() => alert("Google Sign In clicked")}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Sign in with Google
      </button>
    </div>
  );
}

function ProtectedRoute({ token, children }) {
  return token ? children : <Navigate to="/" replace />;
}

export default App;
