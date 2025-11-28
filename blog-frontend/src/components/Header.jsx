import React from "react";
import { FiBell, FiSearch } from "react-icons/fi";

export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-indigo-600">
            Blog Management System
          </div>
          <div className="hidden sm:block">
            <input
              placeholder="Search posts, authors..."
              className="border rounded px-3 py-2 w-80"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FiSearch />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FiBell />
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-sm">{user.username}</div>
              <button
                onClick={onLogout}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Not signed in</div>
          )}
        </div>
      </div>
    </header>
  );
}
