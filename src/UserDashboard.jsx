import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { pathService } from "./services/pathService";
import PathCard from "./components/PathCard";

import CreatePath from "./components/CreatePath";
import EditPath from "./components/EditPath";

function UserDashboard({ token, logout }) {
  const navigate = useNavigate();

  // displaying
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPath, setEditingPath] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBackToPublicPaths = () => {
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

  const handleCreatePath = async (data) => {
    try {
      await pathService.createPath(token, data);
      fetchPaths();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating path:", error);
      setError("Failed to create path. Please try again.");
    }
  };

  const handleEditPathInfo = (path) => {
    setEditingPath(path);
    setShowEditModal(true);
  };

  const handleEditPath = (path) => {
    navigate(`/path/${path.id}/editor`);
  };

  const handleUpdatePath = async (pathId, pathData) => {
    try {
      await pathService.updatePath(token, pathId, pathData);
      fetchPaths();
      setShowEditModal(false);
      setEditingPath(null);
    } catch (error) {
      console.error("Error updating path:", error);
      setError("Failed to update path. Please try again.");
    }
  };

  const handleDeletePath = async (pathId) => {
    if (window.confirm("Are you sure you want to delete this path?")) {
      try {
        await pathService.deletePath(token, pathId);
        fetchPaths();
      } catch (error) {
        console.error("Error deleting path:", error);
        setError("Failed to delete path. Please try again.");
      }
    }
  };

  const handleToggleVisibility = async (pathId, isPublic) => {
    try {
      await pathService.togglePathVisibility(token, pathId, isPublic);
      fetchPaths();
    } catch (error) {
      console.error("Error toggling path visibility:", error);
      setError("Failed to update path visibility. Please try again.");
    }
  };

  // get stats
  const publicPathsCount = paths.filter((path) => path.is_public).length;
  const privatePathsCount = paths.filter((path) => !path.is_public).length;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8">
      {" "}
      <h1 className="text-5xl font-bold mb-8">User Dashboard</h1>
      {/* Stats */}
      <div className="flex flex-row gap-4 w-full max-w-4xl mb-4">
        <div className="flex-1 text-center">
          <span className="text-sm text-gray-600">
            Total Paths: {paths.length} | Public: {publicPathsCount} | Private:{" "}
            {privatePathsCount}
          </span>
        </div>
      </div>
      {/* navigate Buttons */}
      <div className="flex flex-row gap-4 w-full max-w-2xl mb-8">
        <button
          className="flex-1 bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
          onClick={handleBackToPublicPaths}
        >
          ← Back to Public Paths
        </button>
        <button
          className="flex-1 bg-lime-700 hover:bg-lime-950 text-white font-bold py-2 px-4 rounded"
          onClick={() => alert(`Token: ${token}`)}
        >
          Show Auth Token
        </button>
        <button
          className="flex-1 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Path
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
                    onEdit={() => handleEditPathInfo(path)}
                    onDelete={() => handleDeletePath(path.id)}
                    onEditPath={() => handleEditPath(path)}
                    onToggleVisibility={handleToggleVisibility}
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
      <CreatePath
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePath}
      />
      <EditPath
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingPath(null);
        }}
        onSubmit={handleUpdatePath}
        path={editingPath}
      />
    </div>
  );
}

export default UserDashboard;
