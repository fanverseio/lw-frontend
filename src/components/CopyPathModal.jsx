import React, { useState, useEffect } from "react";

function CopyPathModal({ isOpen, onClose, onCopy, originalPath }) {
  const [newTitle, setNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && originalPath) {
      setNewTitle(`${originalPath.title}-copy`);
    }
  }, [isOpen, originalPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsLoading(true);
    try {
      await onCopy(originalPath.id, newTitle.trim());
      onClose();
    } catch (error) {
      console.error("Error copying path:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Copy Learning Path</h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Copying:{" "}
            <span className="font-semibold">{originalPath?.title}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              New Path Name
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter new path name"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading || !newTitle.trim()}
            >
              {isLoading ? "Copying..." : "Copy Path"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CopyPathModal;
