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
          <h1 className="text-4xl text-gray-800 mb-3">Welcome, {user?.name}! 👋</h1>
          <p className="inline-block px-5 py-2 rounded-full font-semibold text-sm uppercase tracking-wider bg-gradient-to-r from-green-500 to-teal-400 text-white">
            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-blue-500">
            <div className="text-5xl">📝</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">My Complaints</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-orange-500">
            <div className="text-5xl">⏳</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">Pending</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl border-l-4 border-purple-500">
            <div className="text-5xl">⚙️</div>
            <div>
              <h3 className="text-sm text-gray-600 font-semibold mb-2">In Progress</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.inProgress}</p>
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

        <div className="text-center my-10">
          <button 
            onClick={() => setShowComplaintForm(true)}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg text-lg font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-400/40"
          >
            ➕ Submit New Complaint
          </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl text-gray-800 mb-5">How to Submit a Complaint</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-purple-600">
              <h3 className="text-lg mb-2 text-gray-800">🏫 Academic Issues</h3>
              <p className="text-sm text-gray-600 mb-3">Course-related, exam issues, faculty concerns</p>
              <span className="inline-block px-3 py-1 bg-purple-600 text-white rounded-xl text-xs font-semibold">Goes to HOD</span>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-purple-600">
              <h3 className="text-lg mb-2 text-gray-800">🏠 Hostel Issues</h3>
              <p className="text-sm text-gray-600 mb-3">Accommodation, facilities, mess complaints</p>
              <span className="inline-block px-3 py-1 bg-purple-600 text-white rounded-xl text-xs font-semibold">Goes to Warden</span>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-purple-600">
              <h3 className="text-lg mb-2 text-gray-800">🧰 Staff Issues</h3>
              <p className="text-sm text-gray-600 mb-3">Teacher/Worker related concerns</p>
              <span className="inline-block px-3 py-1 bg-purple-600 text-white rounded-xl text-xs font-semibold">Goes to Registrar</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl text-gray-800 mb-6">My Complaints</h2>
          
          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Loading your complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-2">📭 You haven't submitted any complaints yet</p>
              <p className="text-sm text-gray-300">
                Click the button above to submit your first complaint
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
                    <h3 className="text-lg font-bold text-gray-800 flex-1">{complaint.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-3 ${
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
                    <div className="flex gap-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {complaint.type === "academic" ? "🏫 Academic" : 
                         complaint.type === "hostel" ? "🏠 Hostel" : 
                         "🧰 Staff"}
                      </span>
                      {complaint.assignedTo && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          Assigned to: {complaint.assignedTo.role.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {complaint.response && (
                    <div className="mt-3 p-3 bg-green-50 rounded border-l-4 border-green-500">
                      <p className="text-xs font-semibold text-green-800 mb-1">Response:</p>
                      <p className="text-sm text-green-700">{complaint.response}</p>
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
