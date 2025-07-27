import React from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard({ token, logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold mb-8">User Dashboard</h1>
      <div className="flex flex-row gap-4 w-full max-w-xs">
        <button
          className="flex-1 bg-lime-700 hover:bg-lime-950 text-white font-bold py-2 px-4 rounded"
          onClick={() => alert(`Token: ${token}`)}
        >
          Show Auth Token
        </button>
        <button
          className="flex-1 bg-amber-700 hover:bg-amber-950 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
