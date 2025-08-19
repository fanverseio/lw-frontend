import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicPathList from "./PublicPathList";
import CopyPathModal from "./CopyPathModal";
import { pathService } from "../services/pathService";
const { getPublicPaths, copyPath } = pathService;

function PublicPathsPage() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [selectedPathToCopy, setSelectedPathToCopy] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    fetchPublicPaths();
  }, []);

  const fetchPublicPaths = async () => {
    console.log("Starting fetchPublicPaths...");
    try {
      setLoading(true);
      setError(null);

      console.log("Making API call to get all public paths");
      const response = await getPublicPaths();
      console.log("API response:", response);

      if (response.success) {
        setPaths(response.paths);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error("Error fetching public paths:", error);
      setError("An error occurred while fetching paths");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPath = async (pathId, newTitle) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    try {
      const response = await pathService.copyPath(token, pathId, newTitle);
      if (response.success) {
        console.log("Path copied successfully!");

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error copying path:", error);
      alert("Failed to copy path. Please try again.");
    }
  };

  const isUserLoggedIn = () => {
    const token = localStorage.getItem("token");
    console.log("Raw token from localStorage:", token);
    console.log("Token type:", typeof token);
    console.log("Token length:", token ? token.length : "null");

    const isValid =
      token && token.trim() !== "" && token !== "null" && token !== "undefined";
    console.log("Is token valid:", isValid);

    return isValid;
  };

  const handleViewDetails = (path) => {
    const loggedIn = isUserLoggedIn();

    if (!loggedIn) {
      // console.log("User is not logged in, redirecting to auth in 3 seconds...");

      setTimeout(() => {
        window.location.href = "/auth";
      }, 3000);
      return;
    }

    console.log("Navigating to path editor for path:", path.id);
    navigate(`/path/${path.id}/editor`);
  };

  const handleCopyPathClick = (path) => {
    console.log("handleCopyPathClick called");
    const loggedIn = isUserLoggedIn();
    console.log("User logged in status:", loggedIn);

    if (!loggedIn) {
      console.log("Redirecting to auth because user is not logged in");
      window.location.href = "/auth";
      return;
    }

    console.log("Opening copy modal for path:", path.id);
    setSelectedPathToCopy(path);
    setShowCopyModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading more paths...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Paths
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPublicPaths}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Learner Weave
              </h1>
              <p className="text-gray-600 mt-1">Visualised learning paths</p>
            </div>
            <div className="flex gap-3">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => (window.location.href = "/dashboard")}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.reload();
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => (window.location.href = "/auth")}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => (window.location.href = "/auth")}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Public Learning Paths
                </h2>
                <p className="text-gray-600">
                  Showing all {paths.length} paths
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {paths.length}
                </div>
                <div className="text-sm text-gray-500">Total Paths</div>
              </div>
            </div>
          </div>
        </div>

        {/* Paths */}
        {paths.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Public Paths Found
            </h3>
            <p className="text-gray-600">
              Be the first to create and share a learning path!
            </p>
            {isLoggedIn && (
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Create Your First Path
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Update the PublicPathList props */}
            <div className="space-y-4 mb-8">
              {paths.map((path) => (
                <PublicPathList
                  key={path.id}
                  path={path}
                  onViewDetails={handleViewDetails}
                  onCopy={handleCopyPathClick}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>

            {/* Copy Path Modal */}
            <CopyPathModal
              isOpen={showCopyModal}
              onClose={() => {
                setShowCopyModal(false);
                setSelectedPathToCopy(null);
              }}
              onCopy={handleCopyPath}
              originalPath={selectedPathToCopy}
            />
          </>
        )}
      </main>

      {/* Footer - Remove container constraints */}
      <footer className="bg-white border-t mt-16 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; Footer text.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicPathsPage;
