import React from "react";
import { useNavigate } from "react-router-dom";

function PublicPathsPage({ token }) {
  const navigate = useNavigate();

  const handleGoDashboard = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold mb-8">This is the public paths page</h1>

      <div className="flex gap-4">
        <button
          onClick={handleGoDashboard}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          {token ? "Go to Dashboard" : "Login / Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default PublicPathsPage;
