import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import assets from "../assets/assets";

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
    <div className="min-h-screen bg-gray-100">
      {/* Header Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <img src={assets.logo} alt="BIAS Logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-800 truncate">BIAS Grievance Portal</h2>
                <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">Birla Institute of Applied Sciences</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role.toUpperCase()} {user?.department && `• ${user?.department}`}</p>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 sm:px-5 sm:py-2 bg-[#021189] text-white rounded-lg text-sm sm:text-base font-medium transition-all hover:shadow-lg hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-8xl mx-auto px-6 lg:px-20 py-8">
        {/* Welcome Section */}
        <div className="bg-[#021189] rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user?.role === "hod" ? "HOD" : user?.role === "warden" ? "Warden" : "Registrar"}! 👔</h1>
              <p className="text-blue-100 text-lg">Manage and resolve assigned grievances</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <p className="text-xs text-blue-100 mb-1">Your Role</p>
                <p className="text-lg font-bold">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <p className="text-xs text-blue-100 mb-1">Complaint Type</p>
                <p className="text-lg font-bold">{getComplaintType()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📨</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
            <h3 className="text-xl lg:text-2xl font-medium text-black">Assigned to Me</h3>
            <p className="text-xs lg:text-lg text-gray-600 mt-1">Total assignments</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
            </div>
            <h3 className="text-xl lg:text-2xl font-medium text-black">In Progress</h3>
            <p className="text-xs lg:text-lg text-gray-600 mt-1">Being resolved</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔼</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-600">{stats.escalated}</p>
              </div>
            </div>
            <h3 className="text-xl lg:text-2xl font-medium text-black">Escalated</h3>
            <p className="text-xs lg:text-lg text-gray-600 mt-1">Sent to Director</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
              </div>
            </div>
            <h3 className="text-xl lg:text-2xl font-medium text-black">Resolved</h3>
            <p className="text-xs lg:text-lg text-gray-600 mt-1">Successfully closed</p>
          </div>
        </div>

        {/* Responsibilities Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl lg:text-4xl font-bold text-gray-800 mb-2">Your Responsibilities</h2>
          <p className="text-gray-600 mb-6">Manage {getComplaintType()} complaints efficiently</p>
          <ul className="list-none p-0 m-0 space-y-3">
            <li className="py-3 text-sm lg:text-lg text-gray-700 border-b border-gray-100 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">📋</span>
              <span>Handle <strong>{getComplaintType()}</strong> complaints</span>
            </li>
            <li className="py-3 text-sm lg:text-lg text-gray-700 border-b border-gray-100 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">✅</span>
              <span>Update complaint status (Pending → In Progress → Resolved)</span>
            </li>
            <li className="py-3 text-sm lg:text-lg text-gray-700 border-b border-gray-100 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🔼</span>
              <span>Escalate unresolved issues to Director</span>
            </li>
            <li className="py-3 text-sm lg:text-lg text-gray-700 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">💬</span>
              <span>Provide responses and solutions to complainants</span>
            </li>
          </ul>
        </div>

        {/* Complaints List */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-800">Complaints Assigned to You</h2>
              <p className="text-sm lg:text-lg text-gray-500 mt-1">Review and manage your assignments</p>
            </div>
            <div className="text-sm text-gray-500">
              {complaints.length} {complaints.length === 1 ? 'complaint' : 'complaints'}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4">Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">📭</span>
              </div>
              <p className="text-lg text-gray-800 font-semibold mb-2">No complaints assigned yet</p>
              <p className="text-sm text-gray-500 mb-6">
                {getComplaintType()} complaints will appear here when submitted
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg lg:text-2xl font-bold text-gray-800 mb-2">{complaint.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        From: <strong>{complaint.createdBy?.name}</strong> ({complaint.createdBy?.role})
                        {complaint.createdBy?.department && ` - ${complaint.createdBy.department}`}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                        </svg>
                        <span>{new Date(complaint.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      complaint.status === "Pending" ? "bg-orange-100 text-orange-700" :
                      complaint.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                      complaint.status === "Escalated" ? "bg-red-100 text-red-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 lg:text-lg mb-4 leading-relaxed">{complaint.description}</p>
                  
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      complaint.type === "academic" ? "bg-blue-100 text-blue-700" : 
                      complaint.type === "hostel" ? "bg-purple-100 text-purple-700" : 
                      "bg-indigo-100 text-indigo-700"
                    }`}>
                      {complaint.type === "academic" ? "🏫 Academic" : 
                       complaint.type === "hostel" ? "🏠 Hostel" : 
                       "🧰 Staff"}
                    </span>
                  </div>

                  {complaint.status !== "Escalated" && complaint.status !== "Resolved" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleEscalate(complaint._id)}
                        className="px-4 py-2 bg-[#021189] text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
                      >
                        <span>🔼</span> Escalate to Director
                      </button>
                    </div>
                  )}

                  {complaint.status === "Escalated" && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <p className="text-sm text-red-700">This complaint has been escalated to the Director</p>
                      </div>
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
