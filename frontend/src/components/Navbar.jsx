import React from "react";

const Navbar = () => {
  return (
    <div className="w-full bg-white shadow px-6 py-3 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Bank Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Hello, User</span>
        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
