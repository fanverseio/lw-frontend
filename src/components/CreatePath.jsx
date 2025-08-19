import React, { useState } from "react";

function CreatePath({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    estimatedHours: "",
  });
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        estimatedHours: parseInt(formData.estimatedHours),
      });
      setFormData({
        title: "",
        description: "",
        difficulty: "beginner",
        estimatedHours: "",
      });
      onClose();
    } catch (error) {
      console.error("Error creating path:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black
  bg-opacity-50 flex items-center justify-center
  z-50"
    >
      <div
        className="bg-white rounded-lg p-6
  w-full max-w-md"
      >
        <h2
          className="text-xl font-bold
  mb-4"
        >
          Create New Learning Path
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm
  font-medium mb-2"
            >
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border
  border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm
  font-medium mb-2"
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border
  border-gray-300 rounded h-20"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm
  font-medium mb-2"
            >
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
              className="w-full p-2 border
  border-gray-300 rounded"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm
  font-medium mb-2"
            >
              Estimated Hours
            </label>
            <input
              type="number"
              value={formData.estimatedHours}
              onChange={(e) =>
                setFormData({ ...formData, estimatedHours: e.target.value })
              }
              className="w-full p-2 border
  border-gray-300 rounded"
              required
              min="1"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600
  border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600
  text-white rounded hover:bg-blue-700"
            >
              Create Path
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePath;
