import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const DirectorDashboard = () => {
  const { user, logout } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">🎓 Grievance System</h2>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-sm">
            <strong>{user?.name}</strong> ({user?.role.toUpperCase()})
          </span>
          <button
            onClick={logout}
            className="px-5 py-2 bg-white/20 text-white border-2 border-white rounded-md font-semibold transition-all hover:bg-white hover:text-purple-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl text-gray-800 mb-3">Welcome, Director! 🎯</h1>
          <p className="inline-block px-5 py-2 rounded-full font-semibold text-sm uppercase tracking-wider bg-gradient-to-r from-pink-500 to-red-500 text-white">
            Super Level Access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-red-500">
            <div className="text-5xl">📋</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">Total Complaints</h3>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-orange-500">
            <div className="text-5xl">⏳</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">Pending</h3>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-blue-500">
            <div className="text-5xl">🔼</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">Escalated to You</h3>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-green-500">
            <div className="text-5xl">✅</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">Resolved</h3>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl text-gray-800 mb-5">Your Privileges</h2>
          <ul className="list-none p-0 m-0">
            <li className="py-3 text-base text-gray-700 border-b border-gray-100">✅ View all complaints across the institution</li>
            <li className="py-3 text-base text-gray-700 border-b border-gray-100">✅ Handle escalated complaints from HOD, Registrar, and Warden</li>
            <li className="py-3 text-base text-gray-700 border-b border-gray-100">✅ Final authority to resolve any complaint</li>
            <li className="py-3 text-base text-gray-700">✅ Access to complete complaint analytics and reports</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl text-gray-800 mb-6">Recent Complaints</h2>
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">📭 No complaints to display yet</p>
            <p className="text-sm text-gray-300">Complaints will appear here once submitted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard;
