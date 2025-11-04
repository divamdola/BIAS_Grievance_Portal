import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const DirectorDashboard = () => {
  const { user, logout, backendUrl } = useContext(AppContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch escalated complaints only
  const fetchEscalatedComplaints = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/complaints/all`);
      if (response.data.success) {
        // Filter to show only escalated complaints
        const escalatedComplaints = response.data.complaints.filter(
          complaint => complaint.status === "Escalated"
        );
        setComplaints(escalatedComplaints);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEscalatedComplaints();
    }
  }, [user]);

  // Calculate stats - only for escalated complaints
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Escalated").length, // All shown are escalated
    resolved: complaints.filter(c => c.status === "Resolved").length,
  };

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
            <div className="text-5xl">🔼</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">Escalated to You</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-orange-500">
            <div className="text-5xl">⏳</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">Awaiting Action</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-blue-500">
            <div className="text-5xl">📊</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">From HOD</h3>
              <p className="text-3xl font-bold text-gray-800">{complaints.filter(c => c.assignedTo?.role === 'hod').length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-purple-500">
            <div className="text-5xl">🏠</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">From Warden</h3>
              <p className="text-3xl font-bold text-gray-800">{complaints.filter(c => c.assignedTo?.role === 'warden').length}</p>
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
          <h2 className="text-2xl text-gray-800 mb-6">🔼 Escalated Complaints</h2>
          <p className="text-sm text-gray-600 mb-4">These complaints have been referred to you by HOD, Warden, or Registrar</p>
          
          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Loading escalated complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-2">📭 No escalated complaints</p>
              <p className="text-sm text-gray-300">Complaints escalated by HOD, Warden, or Registrar will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="border-2 border-gray-200 rounded-lg p-5 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{complaint.title}</h3>
                      <p className="text-sm text-gray-600">
                        From: <strong>{complaint.createdBy?.name}</strong> ({complaint.createdBy?.role})
                        {complaint.createdBy?.department && ` - ${complaint.createdBy.department}`}
                      </p>
                      {complaint.assignedTo && (
                        <p className="text-xs text-gray-500 mt-1">
                          Escalated by: <span className="font-semibold text-red-600">{complaint.assignedTo.name}</span> ({complaint.assignedTo.role.toUpperCase()})
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      complaint.status === "Pending" ? "bg-orange-100 text-orange-700" :
                      complaint.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                      complaint.status === "Escalated" ? "bg-red-100 text-red-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{complaint.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {complaint.type === "academic" ? "🏫 Academic" : 
                       complaint.type === "hostel" ? "🏠 Hostel" : 
                       "🧰 Staff"}
                    </span>
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard;
