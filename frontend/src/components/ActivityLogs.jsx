import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { api } from "../context/AppContext";
import { toast } from "react-toastify";

const ActivityLogs = () => {
  const { backendUrl, user } = useContext(AppContext);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintLogs, setComplaintLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const fetchAllComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/complaints/all`);
      if (response.data.success) {
        setComplaints(response.data.complaints);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error(error.response?.data?.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaintLogs = async (complaintId) => {
    try {
      setLogsLoading(true);
      const response = await api.get(`/api/complaints/${complaintId}/logs`);
      if (response.data.success) {
        setComplaintLogs(response.data.logs);
      }
    } catch (error) {
      console.error("Error fetching complaint logs:", error);
      toast.error(error.response?.data?.message || "Failed to fetch logs");
    } finally {
      setLogsLoading(false);
    }
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    fetchComplaintLogs(complaint._id);
  };

  const handleBackToList = () => {
    setSelectedComplaint(null);
    setComplaintLogs([]);
  };

  const getActionColor = (action) => {
    const colors = {
      submitted: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      resolved: "bg-purple-100 text-purple-800",
      escalated: "bg-orange-100 text-orange-800",
      status_updated: "bg-gray-100 text-gray-800",
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  };

  const getActionIcon = (action) => {
    const icons = {
      submitted: "📝",
      accepted: "✅",
      rejected: "❌",
      resolved: "✔️",
      escalated: "⬆️",
      status_updated: "🔄",
    };
    return icons[action] || "📋";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Accepted: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Resolved: "bg-purple-100 text-purple-800",
      Escalated: "bg-orange-100 text-orange-800",
      Completed: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px] px-4">
        <div className="text-sm sm:text-lg lg:text-xl xl:text-2xl text-gray-600 text-center">Loading complaints...</div>
      </div>
    );
  }

  // Show complaint logs if a complaint is selected
  if (selectedComplaint) {
    return (
      <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Back Button */}
        <button
          onClick={handleBackToList}
          className="mb-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base"
        >
          <span>←</span> Back to Complaints List
        </button>

        {/* Complaint Details Header */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2">
                {selectedComplaint.title}
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3">
                {selectedComplaint.description}
              </p>
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                <span className={`px-3 py-1 rounded-full font-semibold ${getStatusColor(selectedComplaint.status)}`}>
                  {selectedComplaint.status}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                  {selectedComplaint.type}
                </span>
                <span className="text-gray-500">
                  Created: {formatDate(selectedComplaint.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg">
          <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-800">
              Activity Timeline ({complaintLogs.length} entries)
            </h3>
          </div>

          {logsLoading ? (
            <div className="p-8 text-center">
              <div className="text-sm sm:text-base text-gray-600">Loading logs...</div>
            </div>
          ) : complaintLogs.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-xs sm:text-sm lg:text-base xl:text-lg text-gray-500">
              No activity logs found for this complaint
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {complaintLogs.map((log) => (
                <div
                  key={log._id}
                  className="p-3 sm:p-4 lg:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                    <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl flex-shrink-0">
                      {getActionIcon(log.action)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                        <span
                          className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs lg:text-sm font-semibold uppercase ${getActionColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                        <span className="text-[10px] sm:text-xs lg:text-sm xl:text-base text-gray-500">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 mb-1 sm:mb-2 break-words">
                        <span className="font-medium">
                          {log.performedBy?.name}
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          ({log.performedBy?.role})
                        </span>
                        {log.previousStatus && log.newStatus && (
                          <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">
                            changed status from{" "}
                            <span className="font-medium">{log.previousStatus}</span>{" "}
                            to{" "}
                            <span className="font-medium">{log.newStatus}</span>
                          </span>
                        )}
                      </div>

                      {log.remarks && (
                        <div className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-700 bg-gray-100 p-2 sm:p-2.5 lg:p-3 rounded break-words">
                          💬 {log.remarks}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mt-1.5 sm:mt-2 text-[10px] sm:text-xs lg:text-sm xl:text-base text-gray-500">
                        {log.assignedTo && (
                          <span className="break-words">Assigned to: {log.assignedTo.name}</span>
                        )}
                        {log.escalatedTo && (
                          <span className="break-words">Escalated to: {log.escalatedTo.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show complaints list
  return (
    <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
          Complaints Activity Logs
        </h1>
        <p className="text-xs sm:text-base lg:text-xl text-gray-600">
          Click on any complaint to view its complete activity timeline
        </p>
      </div>

      {/* Complaints Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <div className="bg-blue-50 p-3 sm:p-4 lg:p-6 rounded-md sm:rounded-lg lg:rounded-xl border border-blue-200">
          <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-700">
            {complaints.length}
          </div>
          <div className="text-[10px] sm:text-xs lg:text-sm xl:text-base text-blue-600 mt-0.5 sm:mt-1">Total Complaints</div>
        </div>
        <div className="bg-yellow-50 p-3 sm:p-4 lg:p-6 rounded-md sm:rounded-lg lg:rounded-xl border border-yellow-200">
          <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-yellow-700">
            {complaints.filter((c) => c.status === "Pending").length}
          </div>
          <div className="text-[10px] sm:text-xs lg:text-sm xl:text-base text-yellow-600 mt-0.5 sm:mt-1">Pending</div>
        </div>
        <div className="bg-purple-50 p-3 sm:p-4 lg:p-6 rounded-md sm:rounded-lg lg:rounded-xl border border-purple-200">
          <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-purple-700">
            {complaints.filter((c) => c.status === "Resolved" || c.status === "Completed").length}
          </div>
          <div className="text-[10px] sm:text-xs lg:text-sm xl:text-base text-purple-600 mt-0.5 sm:mt-1">Resolved</div>
        </div>
        <div className="bg-orange-50 p-3 sm:p-4 lg:p-6 rounded-md sm:rounded-lg lg:rounded-xl border border-orange-200">
          <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-orange-700">
            {complaints.filter((c) => c.status === "Escalated").length}
          </div>
          <div className="text-[10px] sm:text-xs lg:text-sm xl:text-base text-orange-600 mt-0.5 sm:mt-1">Escalated</div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl border border-gray-200">
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1">
                All Complaints
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {complaints.length} {complaints.length === 1 ? 'complaint' : 'complaints'} in total
              </p>
            </div>
            <div className="hidden sm:block text-3xl sm:text-4xl">
              📋
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {complaints.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="text-4xl sm:text-5xl mb-4">📭</div>
              <div className="text-sm sm:text-base lg:text-lg text-gray-500">
                No complaints found
              </div>
            </div>
          ) : (
            complaints.map((complaint, index) => (
              <div
                key={complaint._id}
                onClick={() => handleComplaintClick(complaint)}
                className="group p-4 sm:p-5 lg:p-6 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-indigo-600 hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    {/* Complaint Number and Title */}
                    <div className="flex items-start gap-2 sm:gap-3 mb-2">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm lg:text-base">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 break-words group-hover:text-indigo-700 transition-colors">
                          {complaint.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-3 leading-relaxed line-clamp-2 break-words ml-0 sm:ml-11 lg:ml-12">
                      {complaint.description}
                    </p>

                    {/* Badges and Info */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-0 sm:ml-11 lg:ml-12">
                      <span className={`px-3 py-1 rounded-full font-semibold text-xs sm:text-sm shadow-sm ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-semibold text-xs sm:text-sm capitalize shadow-sm">
                        📁 {complaint.type}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1 text-xs sm:text-sm font-medium">
                        <span className="text-sm sm:text-base">📅</span> 
                        <span className="hidden sm:inline">Created: </span>
                        {formatDate(complaint.createdAt)}
                      </span>
                      {complaint.assignedTo && (
                        <span className="text-gray-500 flex items-center gap-1 text-xs sm:text-sm font-medium">
                          <span className="text-sm sm:text-base">👤</span>
                          {complaint.assignedTo.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button - Right Side, Vertically Centered */}
                  <div className="flex-shrink-0 flex justify-center sm:justify-end">
                    <button className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-2 group-hover:scale-105">
                      <span>View Activity Logs</span>
                      <span className="text-base sm:text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;