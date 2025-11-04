import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import ComplaintForm from "./ComplaintForm";
import axios from "axios";

const LowLevelDashboard = () => {
  const { user, logout, backendUrl } = useContext(AppContext);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleComplaintSubmit = (newComplaint) => {
    setComplaints([newComplaint, ...complaints]);
  };

  // Fetch user's complaints
  const fetchMyComplaints = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/complaints/my-complaints`);
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
      fetchMyComplaints();
    }
  }, [user]);

  // Calculate stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">B</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">BIAS Grievance Portal</h2>
                <p className="text-xs text-gray-500">Birla Institute of Applied Sciences</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role.toUpperCase()} {user?.department && `• ${user?.department}`}</p>
              </div>
              <button
                onClick={logout}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
              <p className="text-blue-100 text-lg">Manage and track your grievances efficiently</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <p className="text-xs text-blue-100 mb-1">Your Role</p>
                <p className="text-lg font-bold">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <p className="text-xs text-blue-100 mb-1">Department</p>
                <p className="text-lg font-bold">{user?.department || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Complaints</h3>
            <p className="text-xs text-gray-400 mt-1">All submissions</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Pending Review</h3>
            <p className="text-xs text-gray-400 mt-1">Awaiting response</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
            <p className="text-xs text-gray-400 mt-1">Being addressed</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Resolved</h3>
            <p className="text-xs text-gray-400 mt-1">Successfully closed</p>
          </div>
        </div>

        {/* Submit Complaint Button */}
        <div className="text-center mb-8">
          <button 
            onClick={() => setShowComplaintForm(true)}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105 inline-flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4"></path>
            </svg>
            Submit New Complaint
          </button>
        </div>

        {/* Information Cards */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Complaint Categories</h2>
          <p className="text-gray-600 mb-6">Choose the appropriate category when submitting your complaint</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏫</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Academic Issues</h3>
              <p className="text-sm text-gray-600 mb-4">Course-related, exam issues, faculty concerns</p>
              <div className="flex items-center gap-2 text-xs text-blue-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"></path>
                </svg>
                <span className="font-semibold">Assigned to HOD</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Hostel Issues</h3>
              <p className="text-sm text-gray-600 mb-4">Accommodation, facilities, mess complaints</p>
              <div className="flex items-center gap-2 text-xs text-purple-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"></path>
                </svg>
                <span className="font-semibold">Assigned to Warden</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧰</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Staff Issues</h3>
              <p className="text-sm text-gray-600 mb-4">Teacher/Worker related concerns</p>
              <div className="flex items-center gap-2 text-xs text-indigo-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"></path>
                </svg>
                <span className="font-semibold">Assigned to Registrar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">My Complaints</h2>
              <p className="text-sm text-gray-500 mt-1">Track and manage all your submissions</p>
            </div>
            <div className="text-sm text-gray-500">
              {complaints.length} {complaints.length === 1 ? 'complaint' : 'complaints'}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4">Loading your complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">📭</span>
              </div>
              <p className="text-lg text-gray-800 font-semibold mb-2">No complaints yet</p>
              <p className="text-sm text-gray-500 mb-6">
                Click the button above to submit your first complaint
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
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{complaint.title}</h3>
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
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{complaint.description}</p>
                  
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
                    {complaint.assignedTo && (
                      <span className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">
                        Assigned to: {complaint.assignedTo.role.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  {complaint.response && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-green-800 mb-1">Official Response</p>
                          <p className="text-sm text-green-700">{complaint.response}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showComplaintForm && (
        <ComplaintForm
          onClose={() => setShowComplaintForm(false)}
          onSubmitSuccess={handleComplaintSubmit}
        />
      )}
    </div>
  );
};

export default LowLevelDashboard;
