import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import UserDashboard from "./UserDashboard";

function App() {
  const [token, setToken] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage setToken={setToken} />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute token={token}>
              <UserDashboard token={token} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function AuthPage({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email == "dummyaccount@gmail.com" && password == "dummy123") {
      setToken("dummy-token-123");
      navigate("/dashboard");
    } else {
      setError("Wrong username or password");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-20 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Learner Weave</h1>
      <h2 className="font-light text-gray-800 mb-4">
        {isSignIn ? "Sign In" : "Sign Up"}
      </h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
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
        onClick={() => setIsSignIn((prev) => !prev)}
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
