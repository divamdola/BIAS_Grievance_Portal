import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { api } from "../context/AppContext";
import assets from "../assets/assets";
import { toast } from 'react-toastify';

const MediumLevelDashboard = () => {
  const { user, logout, backendUrl } = useContext(AppContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddOldComplaintModal, setShowAddOldComplaintModal] = useState(false);
  const [oldComplaintForm, setOldComplaintForm] = useState({
    title: "",
    description: "",
    type: "",
    studentName: "",
    studentEmail: "",
    customDate: "",
    status: "Completed",
    response: ""
  });

  // Determine the type of complaints this user handles
  const getComplaintType = () => {
    if (user?.role === "hod") return "Academic";
    if (user?.role === "chief_hostel_warden") return "Hostel";
    if (user?.role === "registrar") return "Staff (Faculty/Staff)";
    return "N/A";
  };

  // Get complaint type code for form
  const getComplaintTypeCode = () => {
    if (user?.role === "hod") return "academic";
    if (user?.role === "chief_hostel_warden") return "hostel";
    if (user?.role === "registrar") return "staff";
    return "";
  };

  // Fetch assigned complaints
  const fetchComplaints = async () => {
    try {
      const response = await api.get(`/api/complaints/assigned`);
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

  // Reject complaint
  const handleReject = async (complaintId) => {
    const reason = prompt("Please provide a reason for rejection (optional):");
    if (!confirm("Are you sure you want to reject this complaint?")) {
      return;
    }

    try {
      const response = await api.put(
        `/api/complaints/${complaintId}/reject`,
        { reason }
      );

      if (response.data.success) {
        toast.success("Complaint rejected successfully!");
        fetchComplaints(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to reject complaint");
      }
    } catch (error) {
      console.error("Error rejecting complaint:", error);
      toast.error("Error rejecting complaint. Please try again.");
    }
  };

  // Accept/Confirm complaint
  const handleAccept = async (complaintId) => {
    if (!confirm("Are you sure you want to accept this complaint?")) {
      return;
    }

    try {
      const response = await api.put(
        `/api/complaints/${complaintId}/accept`
      );

      if (response.data.success) {
        toast.success("Complaint accepted successfully!");
        fetchComplaints(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to accept complaint");
      }
    } catch (error) {
      console.error("Error accepting complaint:", error);
      toast.error("Error accepting complaint. Please try again.");
    }
  };

  // Resolve complaint
  const handleResolve = async (complaintId) => {
    const response = prompt("Please provide resolution details (optional):");
    if (!confirm("Are you sure you want to mark this complaint as resolved?")) {
      return;
    }

    try {
      const res = await api.put(
        `/api/complaints/${complaintId}/resolve`,
        { response }
      );

      if (res.data.success) {
        toast.success("Complaint resolved successfully!");
        fetchComplaints(); // Refresh the list
      } else {
        toast.error(res.data.message || "Failed to resolve complaint");
      }
    } catch (error) {
      console.error("Error resolving complaint:", error);
      toast.error("Error resolving complaint. Please try again.");
    }
  };

  // Escalate complaint to Director
  const handleEscalate = async (complaintId) => {
    if (!confirm("Are you sure you want to escalate this complaint to the Director?")) {
      return;
    }

    try {
      const response = await api.put(
        `/api/complaints/${complaintId}/escalate`
      );

      if (response.data.success) {
        toast.success("Complaint escalated to Director successfully!");
        fetchComplaints(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to escalate complaint");
      }
    } catch (error) {
      console.error("Error escalating complaint:", error);
      toast.error("Error escalating complaint. Please try again.");
    }
  };

  // Handle adding old complaint
  const handleAddOldComplaint = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!oldComplaintForm.title || !oldComplaintForm.description || !oldComplaintForm.type || 
        !oldComplaintForm.studentName || !oldComplaintForm.studentEmail || !oldComplaintForm.customDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await api.post("/api/complaints/add-old", oldComplaintForm);
      
      if (response.data.success) {
        toast.success("Old complaint added successfully!");
        setShowAddOldComplaintModal(false);
        // Reset form
        setOldComplaintForm({
          title: "",
          description: "",
          type: "",
          studentName: "",
          studentEmail: "",
          customDate: "",
          status: "Completed",
          response: ""
        });
        fetchComplaints(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to add old complaint");
      }
    } catch (error) {
      console.error("Error adding old complaint:", error);
      toast.error("Error adding old complaint. Please try again.");
    }
  };

  // Calculate stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    accepted: complaints.filter(c => c.status === "Accepted").length,
    rejected: complaints.filter(c => c.status === "Rejected").length,
    completed: complaints.filter(c => c.status === "Completed").length,
  };

  // Sort complaints: Completed and Rejected at bottom, others by date (older first)
  const sortedComplaints = [...complaints].sort((a, b) => {
    const aIsFinished = a.status === "Completed" || a.status === "Rejected";
    const bIsFinished = b.status === "Completed" || b.status === "Rejected";
    
    // If one is finished (completed/rejected) and the other is not, finished goes to bottom
    if (aIsFinished && !bIsFinished) return 1;
    if (!aIsFinished && bIsFinished) return -1;
    
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

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="bg-[#021189] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Welcome, {user?.role === "hod" ? "HOD" : user?.role === "chief_hostel_warden" ? "Chief Hostel Warden" : "Registrar"}! 👔</h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Manage and resolve assigned grievances</p>
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
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">📨</span>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
            <h3 className="text-sm sm:text-base lg:text-2xl font-medium text-black">Assigned to Me</h3>
            <p className="text-xs lg:text-lg text-gray-600 mt-1 hidden sm:block">Total assignments</p>
          </div>

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
            <p className="text-xs lg:text-lg text-gray-600 mt-1 hidden sm:block">Confirmed complaints</p>
          </div>

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
            <p className="text-xs lg:text-lg text-gray-600 mt-1 hidden sm:block">Successfully closed</p>
          </div>
        </div>

        {/* Responsibilities Section */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Your Responsibilities</h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 mb-4 sm:mb-6">Manage {getComplaintType()} complaints efficiently</p>
          <ul className="list-none lg:text-xl p-0 m-0 space-y-3">
            <li className="py-2 sm:py-3 text-xs sm:text-sm lg:text-base text-gray-700 border-b border-gray-100 flex items-start gap-2 sm:gap-3">
              <span className="text-base sm:text-lg flex-shrink-0">📋</span>
              <span>Handle <strong>{getComplaintType()}</strong> complaints</span>
            </li>
            <li className="py-2 sm:py-3 text-xs sm:text-sm lg:text-base text-gray-700 border-b border-gray-100 flex items-start gap-2 sm:gap-3">
              <span className="text-base sm:text-lg flex-shrink-0">✅</span>
              <span>Update complaint status (Pending → Accepted → Completed)</span>
            </li>
            <li className="py-2 sm:py-3 text-xs sm:text-sm lg:text-base text-gray-700 border-b border-gray-100 flex items-start gap-2 sm:gap-3">
              <span className="text-base sm:text-lg flex-shrink-0">🔼</span>
              <span>Escalate unresolved issues to Director</span>
            </li>
            <li className="py-2 sm:py-3 text-xs sm:text-sm lg:text-base text-gray-700 flex items-start gap-2 sm:gap-3">
              <span className="text-base sm:text-lg flex-shrink-0">💬</span>
              <span>Provide responses and solutions to complainants</span>
            </li>
          </ul>
        </div>

        {/* Add Old Complaint Button - TEMPORARILY HIDDEN */}
        {/* <div className="mb-6">
          <button
            onClick={() => {
              setOldComplaintForm({
                title: "",
                description: "",
                type: getComplaintTypeCode(), // Auto-select based on role
                studentName: "",
                studentEmail: "",
                customDate: "",
                status: "Completed",
                response: ""
              });
              setShowAddOldComplaintModal(true);
            }}
            className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-xl">📝</span>
            Add Old/Historical Complaint
          </button>
          <p className="text-sm text-gray-500 mt-2">Manually add past complaints with custom dates for record-keeping</p>
        </div> */}

        {/* Complaints List */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800">🔼 Complaints Assigned to You</h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-1">Review and manage your assignments</p>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
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
              {sortedComplaints.map((complaint) => (
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

                  {complaint.status === "Pending" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleAccept(complaint._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
                      >
                        <span>✅</span> Confirm
                      </button>
                      <button
                        onClick={() => handleReject(complaint._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
                      >
                        <span>❌</span> Reject
                      </button>
                    </div>
                  )}

                  {complaint.status === "Accepted" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleResolve(complaint._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
                      >
                        <span>✅</span> Resolve
                      </button>
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
                  <a href="#" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                    <span>✅</span> Accept Complaints
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                    <span>❌</span> Reject Complaints
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                    <span>🔼</span> Escalate Issues
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                    <span>📊</span> View Reports
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

      {/* Add Old Complaint Modal */}
      {showAddOldComplaintModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-[#021189] text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Add Old/Historical Complaint</h2>
                  <p className="text-blue-100 text-sm mt-1">Manually add past complaints for record-keeping</p>
                </div>
                <button
                  onClick={() => setShowAddOldComplaintModal(false)}
                  className="text-white hover:text-gray-300 text-3xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleAddOldComplaint} className="p-6 space-y-4">
              {/* Complaint Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complaint Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={oldComplaintForm.title}
                  onChange={(e) => setOldComplaintForm({...oldComplaintForm, title: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Enter complaint title"
                  required
                />
              </div>

              {/* Complaint Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={oldComplaintForm.description}
                  onChange={(e) => setOldComplaintForm({...oldComplaintForm, description: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  rows="4"
                  placeholder="Enter complaint details"
                  required
                />
              </div>

              {/* Complaint Type - Auto-selected, read-only */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complaint Type <span className="text-red-500">*</span>
                </label>
                <div className="w-full px-4 py-2 border-2 border-gray-300 bg-gray-100 rounded-lg text-gray-700 font-medium">
                  {oldComplaintForm.type === "academic" && "🏫 Academic"}
                  {oldComplaintForm.type === "hostel" && "🏠 Hostel"}
                  {oldComplaintForm.type === "staff" && "🧰 Staff"}
                  <span className="text-xs text-gray-500 ml-2">(Auto-selected based on your role)</span>
                </div>
                <input type="hidden" value={oldComplaintForm.type} required />
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={oldComplaintForm.studentName}
                  onChange={(e) => setOldComplaintForm({...oldComplaintForm, studentName: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Enter student name"
                  required
                />
              </div>

              {/* Student Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={oldComplaintForm.studentEmail}
                  onChange={(e) => setOldComplaintForm({...oldComplaintForm, studentEmail: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="student@email.com"
                  required
                />
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    ℹ️ <strong>Note:</strong> If the student doesn't have an account, one will be created automatically.
                    Default password: <code className="bg-blue-100 px-1 py-0.5 rounded">student123</code>
                    <br />
                    The student can login with this email and password to view their complaint.
                  </p>
                </div>
              </div>

              {/* Custom Date & Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complaint Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={oldComplaintForm.customDate}
                  onChange={(e) => setOldComplaintForm({...oldComplaintForm, customDate: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Select the original date when this complaint was filed</p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={oldComplaintForm.status}
                  onChange={(e) => setOldComplaintForm({...oldComplaintForm, status: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Response/Resolution */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resolution/Response (Optional)
                </label>
                <textarea
                  value={oldComplaintForm.response}
                  onChange={(e) => setOldComplaintForm({...oldComplaintForm, response: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  rows="3"
                  placeholder="Enter resolution or response (if applicable)"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
                >
                  Add Complaint
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddOldComplaintModal(false)}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediumLevelDashboard;