import React, { useState } from "react";

function PathCard({ path, onEdit, onDelete, onEditPath, onToggleVisibility }) {
  const [isToggling, setIsToggling] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this path?")) {
      onDelete(path.id);
    }
  };

  const handleToggleVisibility = async () => {
    setIsToggling(true);
    try {
      await onToggleVisibility(path.id, !path.is_public);
    } catch (error) {
      console.error("Error toggling visibility:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md
  border border-gray-200 overflow-hidden
  hover:shadow-lg transition-shadow"
    >
      <div className="p-6">
        <div
          className="flex justify-between
  items-start mb-3"
        >
          <h3
            className="text-xl font-bold
  text-gray-800 truncate"
          >
            {path.title}
          </h3>
          <div className="flex items-center gap-3">
            {/* Slide Toggle for Visibility */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600">
                {path.is_public ? "Public" : "Private"}
              </span>
              <button
                onClick={handleToggleVisibility}
                disabled={isToggling}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  path.is_public
                    ? "bg-emerald-900	focus:ring-emerald-800"
                    : "bg-yellow-900	focus:ring-yellow-800"
                } ${
                  isToggling
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    path.is_public ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {/* Difficulty Badge */}
            <span
              className={`px-2 py-1 rounded-full
   text-xs font-semibold
  ${getDifficultyColor(path.difficulty)}`}
            >
              {path.difficulty}
            </span>
          </div>
        </div>

        <p
          className="text-gray-600 mb-4
  line-clamp-3"
        >
          {path.description}
        </p>

        <div
          className="flex justify-between
  items-center text-sm text-gray-500 mb-4"
        >
          <span>Estimated Hours: </span>
          <span className="font-medium">{path.estimatedHours}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(path)}
            className="flex-1 bg-blue-500 hover:bg-blue-600
  text-white font-bold py-2 px-4 rounded-lg text-sm
  transition-colors"
          >
            Edit Info
          </button>
          <button
            onClick={() => onEditPath(path)}
            className="flex-1 bg-green-500 hover:bg-green-600
  text-white font-bold py-2 px-4 rounded-lg text-sm
  transition-colors"
          >
            Edit Path
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-500 hover:bg-red-600
  text-white font-bold py-2 px-4 rounded-lg text-sm
  transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default PathCard;
