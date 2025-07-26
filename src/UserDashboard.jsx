import React from "react";

function UserDashboard({ token }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold mb-8">User Dashboard</h1>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => alert(`Token: ${token}`)}
      >
        Show Auth Token
      </button>
    </div>
  );
}

export default UserDashboard;
