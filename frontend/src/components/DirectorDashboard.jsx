import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { api } from "../context/AppContext";
import assets from "../assets/assets";
import { toast } from 'react-toastify';
import ActivityLogs from "./ActivityLogs";

const DirectorDashboard = () => {
  const { user, logout, backendUrl } = useContext(AppContext);
  const [allComplaints, setAllComplaints] = useState([]);
  const [escalatedComplaints, setEscalatedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("complaints"); // "complaints" or "logs"

  // Fetch all complaints for statistics and escalated complaints
  const fetchComplaints = async () => {
    try {
      const response = await api.get(`/api/complaints/all`);
      if (response.data.success) {
        const allData = response.data.complaints;
        setAllComplaints(allData);
        // Filter to show only escalated complaints in the list
        const escalated = allData.filter(
          complaint => complaint.status === "Escalated"
        );
        setEscalatedComplaints(escalated);
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

  // Resolve complaint
  const handleResolve = async (complaintId) => {
    const response = prompt("Please provide resolution details (optional):");
    if (!confirm("Are you sure you want to mark this complaint as completed?")) {
      return;
    }

    try {
      const res = await api.put(
        `/api/complaints/${complaintId}/resolve`,
        { response }
      );

      if (res.data.success) {
        toast.success("Complaint completed successfully!");
        fetchComplaints(); // Refresh the list
      } else {
        toast.error(res.data.message || "Failed to complete complaint");
      }
    } catch (error) {
      console.error("Error resolving complaint:", error);
      toast.error("Error resolving complaint. Please try again.");
    }
  };

  // Calculate comprehensive stats for all complaints
  const stats = {
    total: allComplaints.length,
    pending: allComplaints.filter(c => c.status === "Pending").length,
    accepted: allComplaints.filter(c => c.status === "Accepted").length,
    rejected: allComplaints.filter(c => c.status === "Rejected").length,
    completed: allComplaints.filter(c => c.status === "Completed").length,
    escalated: allComplaints.filter(c => c.status === "Escalated").length,
  };

  // Sort escalated complaints: Completed at bottom, others by date (older first)
  const sortedEscalatedComplaints = [...escalatedComplaints].sort((a, b) => {
    // If one is completed and the other is not, completed goes to bottom
    if (a.status === "Completed" && b.status !== "Completed") return 1;
    if (a.status !== "Completed" && b.status === "Completed") return -1;
    
    // Otherwise, sort by date (older first - ascending order)
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

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
                <p className="text-xs text-gray-500">{user?.role.toUpperCase()}</p>
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

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="bg-[#021189] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Welcome, Director! 🏛️</h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Oversee and manage the entire grievance system</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <p className="text-xs text-blue-100 mb-1">Your Role</p>
                <p className="text-lg font-bold">Director</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <p className="text-xs text-blue-100 mb-1">Access Level</p>
                <p className="text-lg font-bold">Super Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* System-wide Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {/* Total Complaints */}
          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">📊</span>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
            <h3 className="text-sm sm:text-base lg:text-2xl font-medium text-black">Total Complaints</h3>
            <p className="text-xs lg:text-lg text-gray-600 mt-1 hidden sm:block">All time complaints</p>
          </div>

          {/* Pending */}
          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">⏳</span>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-orange-600">{stats.pending}</p>
              </div>
            </div>
            <h3 className="text-sm sm:text-base lg:text-2xl font-medium text-black">Pending</h3>
            <p className="text-xs lg:text-lg text-gray-600 mt-1 hidden sm:block">Awaiting review</p>
          </div>

          {/* Accepted */}
          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">✅</span>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.accepted}</p>
              </div>
            </div>
            <h3 className="text-sm sm:text-base lg:text-2xl font-medium text-black">Accepted</h3>
            <p className="text-xs lg:text-lg text-gray-600 mt-1 hidden sm:block">Confirmed & in progress</p>
          </div>

          {/* Rejected */}
          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">❌</span>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>
            <h3 className="text-sm sm:text-base lg:text-2xl font-medium text-black">Rejected</h3>
            <p className="text-xs lg:text-lg text-gray-600 mt-1 hidden sm:block">Not approved</p>
          </div>

          {/* Completed */}
          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">🎉</span>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.completed}</p>
              </div>
            </div>
            <h3 className="text-sm sm:text-base lg:text-2xl font-medium text-black">Completed</h3>
            <p className="text-xs lg:text-lg text-gray-600 mt-1 hidden sm:block">Successfully resolved</p>
          </div>

          {/* Escalated */}
          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">🔼</span>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-pink-600">{stats.escalated}</p>
              </div>
            </div>
            <h3 className="text-sm sm:text-base lg:text-2xl font-medium text-black">Escalated</h3>
            <p className="text-xs lg:text-lg text-gray-600 mt-1 hidden sm:block">Require your attention</p>
          </div>
        </div>

        {/* Privileges Section */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Your Privileges</h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 mb-4 sm:mb-6">Full access to all institutional grievances</p>
          <ul className="list-none p-0 m-0 space-y-3">
            <li className="py-2 sm:py-3 text-xs sm:text-sm lg:text-base text-gray-700 border-b border-gray-100 flex items-start gap-2 sm:gap-3">
              <span className="text-base sm:text-lg flex-shrink-0">✅</span>
              <span>View all complaints across the institution</span>
            </li>
            <li className="py-2 sm:py-3 text-xs sm:text-sm lg:text-base text-gray-700 border-b border-gray-100 flex items-start gap-2 sm:gap-3">
              <span className="text-base sm:text-lg flex-shrink-0">✅</span>
              <span>Handle escalated complaints from HOD, Registrar, and Chief Hostel Warden</span>
            </li>
            <li className="py-2 sm:py-3 text-xs sm:text-sm lg:text-base text-gray-700 border-b border-gray-100 flex items-start gap-2 sm:gap-3">
              <span className="text-base sm:text-lg flex-shrink-0">✅</span>
              <span>Final authority to resolve any complaint</span>
            </li>
            <li className="py-2 sm:py-3 text-xs sm:text-sm lg:text-base text-gray-700 flex items-start gap-2 sm:gap-3">
              <span className="text-base sm:text-lg flex-shrink-0">✅</span>
              <span>Access to complete complaint analytics and reports</span>
            </li>
          </ul>
        </div>

        {/* View Toggle Navigation */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveView("complaints")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all ${
              activeView === "complaints"
                ? "bg-[#021189] text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="mr-2">🔼</span>
            Escalated Complaints
          </button>
          <button
            onClick={() => setActiveView("logs")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all ${
              activeView === "logs"
                ? "bg-[#021189] text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="mr-2">📋</span>
            Activity Logs
          </button>
        </div>

        {/* Conditional View Rendering */}
        {activeView === "complaints" ? (
          /* Complaints List */
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800">🔼 Escalated Complaints</h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-1">Referred by HOD, Chief Hostel Warden, or Registrar</p>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {escalatedComplaints.length} {escalatedComplaints.length === 1 ? 'complaint' : 'complaints'}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4">Loading escalated complaints...</p>
            </div>
          ) : escalatedComplaints.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">📭</span>
              </div>
              <p className="text-lg text-gray-800 font-semibold mb-2">No escalated complaints</p>
              <p className="text-sm text-gray-500 mb-6">Complaints escalated by HOD, Chief Hostel Warden, or Registrar will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEscalatedComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3 sm:mb-4 gap-2">
                    <div className="flex-1 w-full">
                      <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">{complaint.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        From: <strong>{complaint.createdBy?.name}</strong> ({complaint.createdBy?.role})
                        {complaint.createdBy?.department && ` - ${complaint.createdBy.department}`}
                      </p>
                      {complaint.assignedTo && (
                        <p className="text-xs text-red-600 font-medium mb-1">
                          Escalated by: {complaint.assignedTo.name} ({complaint.assignedTo.role.toUpperCase()})
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                        </svg>
                        <span>{new Date(complaint.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      complaint.status === "Pending" ? "bg-orange-100 text-orange-700" :
                      complaint.status === "Accepted" ? "bg-green-100 text-green-700" :
                      complaint.status === "Rejected" ? "bg-red-100 text-red-700" :
                      complaint.status === "Escalated" ? "bg-pink-100 text-pink-700" :
                      complaint.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  
                  <p className="text-sm sm:text-base lg:text-xl text-gray-700 mb-3 sm:mb-4 leading-relaxed">{complaint.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 border-t border-gray-200">
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

                  {complaint.status === "Escalated" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleResolve(complaint._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
                      >
                        <span>✅</span> Resolve
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        ) : (
          /* Activity Logs View */
          <ActivityLogs />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#021189] text-white mt-12">
        <div className="max-w-8xl mx-auto px-6 lg:px-20 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">🏛️</span>
                BIAS Grievance Portal
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Birla Institute of Applied Sciences is committed to addressing student, faculty, and staff concerns efficiently and transparently.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => setActiveView("complaints")}
                    className="text-blue-100 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>🔼</span> Escalated Complaints
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveView("logs")}
                    className="text-blue-100 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>📋</span> Activity Logs
                  </button>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                    <span>📊</span> Analytics Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                    <span>📈</span> Reports
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm text-blue-100">
                <li className="flex items-start gap-2">
                  <span className="text-lg">📍</span>
                  <span>Birla Institute of Applied Sciences<br />Bhimtal, Uttarakhand</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">📧</span>
                  <span>grievance@bias.edu.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">📞</span>
                  <span>+91-XXXX-XXXXXX</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-3">
              <p className="text-sm text-blue-100">
                © {new Date().getFullYear()} Birla Institute of Applied Sciences. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-blue-100">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
              </div>
            </div>
            <div className="text-center text-sm text-blue-200">
              <p>Developed by <span className="font-semibold text-white">Deepanshu Melkani</span> and <span className="font-semibold text-white">Divyanshu Amdola</span></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DirectorDashboard;