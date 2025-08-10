import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { pathService } from "./services/pathService";
import PathCard from "./components/PathCard";

function UserDashboard({ token, logout }) {
  const navigate = useNavigate();

  // displaying
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pathService.getAllPaths(token);
      setPaths(data);
    } catch (error) {
      console.error("Error fetching paths:", error);
      setError("Failed to load paths. Please try again.");
    } finally {
      setLoading(false);
    }
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
      <div className="w-full max-w-6xl mt-8">
        <h2 className="text-2xl font-bold mb-6">Your Learning Paths</h2>

        {error && (
          <div
            className="bg-red-100 border
  border-red-400 text-red-700 px-4 py-3 rounded
  mb-4"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading your paths...</div>
        ) : (
          <>
            {paths.length > 0 ? (
              <div
                className="grid grid-cols-1
  md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paths.map((path) => (
                  <PathCard
                    key={path.id}
                    path={path}
                    onEdit={() => console.log("Edit", path.id)}
                    onDelete={() => console.log("Delete", path.id)}
                  />
                ))}
              </div>
            ) : (
              <div
                className="text-center py-8
  text-gray-500"
              >
                No learning paths yet. Create your first one!
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
