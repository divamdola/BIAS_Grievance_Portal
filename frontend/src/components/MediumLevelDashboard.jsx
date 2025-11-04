import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const MediumLevelDashboard = () => {
  const { user, logout, backendUrl } = useContext(AppContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine the type of complaints this user handles
  const getComplaintType = () => {
    if (user?.role === "hod") return "Academic";
    if (user?.role === "warden") return "Hostel";
    if (user?.role === "registrar") return "Staff (Teacher/Worker)";
    return "N/A";
  };

  // Fetch assigned complaints
  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/complaints/assigned`);
      if (response.data.success) {
        setComplaints(response.data.complaints);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);

  // Escalate complaint to Director
  const handleEscalate = async (complaintId) => {
    if (!confirm("Are you sure you want to escalate this complaint to the Director?")) {
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/complaints/${complaintId}/escalate`
      );

      if (response.data.success) {
        alert("Complaint escalated to Director successfully!");
        fetchComplaints(); // Refresh the list
      } else {
        alert(response.data.message || "Failed to escalate complaint");
      }
    } catch (error) {
      console.error("Error escalating complaint:", error);
      alert("Error escalating complaint. Please try again.");
    }
  };

  // Calculate stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    escalated: complaints.filter(c => c.status === "Escalated").length,
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
            {user?.department && ` - ${user?.department}`}
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
          <h1 className="text-4xl text-gray-800 mb-3">Welcome, {user?.role === "hod" ? "HOD" : user?.role === "warden" ? "Warden" : "Registrar"}! 👔</h1>
          <p className="inline-block px-5 py-2 rounded-full font-semibold text-sm uppercase tracking-wider bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            Medium Level Access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-orange-500">
            <div className="text-5xl">📨</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">Assigned to Me</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-blue-500">
            <div className="text-5xl">⏳</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">In Progress</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.inProgress}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-red-500">
            <div className="text-5xl">🔼</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">Escalated</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.escalated}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-green-500">
            <div className="text-5xl">✅</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">Resolved</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl text-gray-800 mb-5">Your Responsibilities</h2>
          <ul className="list-none p-0 m-0">
            <li className="py-3 text-base text-gray-700 border-b border-gray-100">📋 Handle <strong>{getComplaintType()}</strong> complaints</li>
            <li className="py-3 text-base text-gray-700 border-b border-gray-100">✅ Update complaint status (Pending → In Progress → Resolved)</li>
            <li className="py-3 text-base text-gray-700 border-b border-gray-100">🔼 Escalate unresolved issues to Director</li>
            <li className="py-3 text-base text-gray-700">💬 Provide responses and solutions to complainants</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl text-gray-800 mb-6">Complaints Assigned to You</h2>
          
          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-2">📭 No complaints assigned yet</p>
              <p className="text-sm text-gray-300">
                {getComplaintType()} complaints will appear here when submitted
              </p>
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
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {complaint.type === "academic" ? "🏫 Academic" : 
                       complaint.type === "hostel" ? "🏠 Hostel" : 
                       "🧰 Staff"}
                    </span>
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>

                  {complaint.status !== "Escalated" && complaint.status !== "Resolved" && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleEscalate(complaint._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all"
                      >
                        🔼 Escalate to Director
                      </button>
                    </div>
                  )}

                  {complaint.status === "Escalated" && (
                    <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-700">
                      ✅ This complaint has been escalated to the Director
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediumLevelDashboard;
