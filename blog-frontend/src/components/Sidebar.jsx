import React from "react";
import { FiHome, FiFileText, FiTag, FiUsers } from "react-icons/fi";

export default function Sidebar({ user }) {
  return (
    <aside className="w-72 bg-white border-r hidden lg:block">
      <nav className="p-4 space-y-2">
        <div className="px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-3">
          <FiHome /> Dashboard
        </div>
        {user?.role === "ROLE_ADMIN" && (
          <>
            <div className="px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-3">
              <FiUsers /> Users
            </div>
            <div className="px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-3">
              <FiFileText /> Categories
            </div>
            <div className="px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-3">
              <FiTag /> Tags
            </div>
          </>
        )}
        {/* <div className="px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-3">Explore</div> */}
      </nav>
    </aside>
  );
}
