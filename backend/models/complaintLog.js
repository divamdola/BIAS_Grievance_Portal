const mongoose = require("mongoose");

const complaintLogSchema = new mongoose.Schema({
  complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
    required: true,
  },
  action: {
    type: String,
    enum: [
      "submitted",
      "accepted",
      "rejected",
      "resolved",
      "escalated",
      "status_updated",
      "assigned",
    ],
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  previousStatus: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "In Progress", "Resolved", "Escalated", "Completed"],
  },
  newStatus: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "In Progress", "Resolved", "Escalated", "Completed"],
  },
  remarks: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  escalatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
complaintLogSchema.index({ complaint: 1, timestamp: -1 });
complaintLogSchema.index({ performedBy: 1 });

module.exports = mongoose.model("ComplaintLog", complaintLogSchema);