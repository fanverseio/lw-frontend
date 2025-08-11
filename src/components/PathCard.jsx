import React from "react";

function PathCard({ path, onEdit, onDelete, onEditPath }) {
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
          <span
            className={`px-2 py-1 rounded-full
   text-xs font-semibold
  ${getDifficultyColor(path.difficulty)}`}
          >
            {path.difficulty}
          </span>
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
          <span className="font-medium">
            {path.estimatedHours}
            hours
          </span>
          <span>ID: {path.id}</span>
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
