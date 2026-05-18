import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: {
    type: String,
    enum: ["academic", "hostel", "staff"],
    required: true
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["Pending","Accepted","Rejected", "In Progress", "Resolved", "Escalated", "Completed"],
    default: "Pending"
  },
  response: String,
  escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Complaint", complaintSchema);