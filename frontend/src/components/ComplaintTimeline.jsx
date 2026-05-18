import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const ComplaintTimeline = ({ complaintId, onClose }) => {
  const { backendUrl } = useContext(AppContext);
  const [logs, setLogs] = useState([]);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaintLogs();
  }, [complaintId]);

  const fetchComplaintLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/complaints/${complaintId}/logs`
      );
      if (response.data.success) {
        setLogs(response.data.logs);
        setComplaint(response.data.complaint);
      }
    } catch (error) {
      console.error("Error fetching complaint logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    const colors = {
      submitted: "border-blue-500 bg-blue-50",
      accepted: "border-green-500 bg-green-50",
      rejected: "border-red-500 bg-red-50",
      resolved: "border-purple-500 bg-purple-50",
      escalated: "border-orange-500 bg-orange-50",
    };
    return colors[action] || "border-gray-500 bg-gray-50";
  };

  const getActionIcon = (action) => {
    const icons = {
      submitted: "📝",
      accepted: "✅",
      rejected: "❌",
      resolved: "✔️",
      escalated: "⬆️",
    };
    return icons[action] || "📋";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center">Loading timeline...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Complaint Timeline
            </h2>
            {complaint && (
              <div>
                <p className="text-gray-600 font-medium">{complaint.title}</p>
                <div className="flex gap-3 mt-2 text-sm">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    Type: {complaint.type}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    Status: {complaint.status}
                  </span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          {logs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No activity logs found for this complaint
            </div>
          ) : (
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>

              {/* Timeline Items */}
              <div className="space-y-6">
                {logs.map((log, index) => (
                  <div key={log._id} className="relative flex gap-4">
                    {/* Icon Circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-4 ${getActionColor(
                        log.action
                      )} z-10 flex-shrink-0`}
                    >
                      {getActionIcon(log.action)}
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {/* Action & Date */}
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-800 uppercase text-sm">
                          {log.action}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>

                      {/* Performed By */}
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">
                          {log.performedBy?.name}
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          ({log.performedBy?.role})
                        </span>
                      </div>

                      {/* Status Change */}
                      {log.previousStatus && log.newStatus && (
                        <div className="text-sm mb-2">
                          <span className="text-gray-600">Status: </span>
                          <span className="line-through text-gray-400">
                            {log.previousStatus}
                          </span>
                          <span className="mx-2">→</span>
                          <span className="font-semibold text-gray-800">
                            {log.newStatus}
                          </span>
                        </div>
                      )}

                      {/* Remarks */}
                      {log.remarks && (
                        <div className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200 mt-2">
                          💬 {log.remarks}
                        </div>
                      )}

                      {/* Additional Info */}
                      {(log.assignedTo || log.escalatedTo) && (
                        <div className="mt-2 text-xs text-gray-600">
                          {log.assignedTo && (
                            <div>
                              👤 Assigned to:{" "}
                              <span className="font-medium">
                                {log.assignedTo.name}
                              </span>
                            </div>
                          )}
                          {log.escalatedTo && (
                            <div>
                              ⬆️ Escalated to:{" "}
                              <span className="font-medium">
                                {log.escalatedTo.name}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Close Timeline
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintTimeline;