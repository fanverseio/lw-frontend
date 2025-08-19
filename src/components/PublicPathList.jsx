import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PublicPathList = ({ path, onViewDetails, onCopy, isLoggedIn }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();

  // small screen breakpoint 850px
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 850);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // shorten title
  const truncateTitle = (title, maxLength) => {
    if (title.length <= maxLength) return title;
    const truncated = title.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + "...";
    }

    return truncated + "...";
  };

  const handleViewDetails = () => {
    // if (!isLoggedIn) {
    //   window.location.href = "/auth";
    //   return;
    // }
    onViewDetails(path);
  };

  const handleCopyPath = async () => {
    // if (!isLoggedIn) {
    //   window.location.href = "/auth";
    //   return;
    // }
    onCopy(path);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isSmallScreen) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
        {/* Difficulty Badge */}
        <div className="flex items-center mb-3">
          <span
            className={`difficulty-circle ${getDifficultyColor(
              path.difficulty
            )}`}
          >
            <span>{path.difficulty}</span>
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {truncateTitle(path.title, 29)}
        </h3>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            View
          </button>
          <button
            onClick={handleCopyPath}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isCopied
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    );
  }

  // normal screen
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between gap-4">
        {/* difficulty and title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap ${getDifficultyColor(
              path.difficulty
            )}`}
          >
            {path.difficulty}
          </span>
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {path.title}
          </h3>
        </div>

        {/* buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleViewDetails}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
          >
            View Details
          </button>
          <button
            onClick={handleCopyPath}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              isCopied
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {isCopied ? "Copied!" : "Copy Path"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicPathList;
