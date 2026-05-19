import Complaint from "../models/complaint.js";
import User from "../models/user.js";
import ComplaintLog from "../models/complaintLog.js";
import bcrypt from "bcryptjs";
import { logComplaintAction } from "../utils/complaintLogger.js";

// Submit a new complaint
const submitComplaint = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const userId = req.userId;

    // Validate input
    if (!title || !description || !type) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate complaint type
    if (!["academic", "hostel", "staff"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint type",
      });
    }

    // Find the appropriate authority to assign based on type
    let assignedTo = null;
    
    if (type === "academic") {
      // Assign to HOD (you can make this more specific by department if needed)
      const hod = await User.findOne({ role: "hod" });
      if (hod) assignedTo = hod._id;
    } else if (type === "hostel") {
      // Assign to Chief Hostel Warden
      const chief_hostel_warden = await User.findOne({ role: "chief_hostel_warden" });
      if (chief_hostel_warden) assignedTo = chief_hostel_warden._id;
    } else if (type === "staff") {
      // Assign to Registrar
      const registrar = await User.findOne({ role: "registrar" });
      if (registrar) assignedTo = registrar._id;
    }

    // Create new complaint
    const newComplaint = new Complaint({
      title,
      description,
      type,
      createdBy: userId,
      assignedTo,
      status: "Pending",
    });

    await newComplaint.save();

    // Log complaint submission
    await logComplaintAction({
      complaintId: newComplaint._id,
      action: "submitted",
      performedBy: userId,
      newStatus: "Pending",
      assignedTo: assignedTo,
      remarks: `Complaint submitted: ${title}`,
    });

    // Populate creator details for response
    await newComplaint.populate("createdBy", "name email role department");
    await newComplaint.populate("assignedTo", "name email role");

    // Send response immediately
    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    console.error("Submit complaint error:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting complaint",
      error: error.message,
    });
  }
};

// Get all complaints for the logged-in user
const getMyComplaints = async (req, res) => {
  try {
    const userId = req.userId;

    const complaints = await Complaint.find({ createdBy: userId })
      .populate("assignedTo", "name role")
      .populate("escalatedTo", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Get my complaints error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching complaints",
      error: error.message,
    });
  }
};

// Get complaints assigned to a medium-level user (HOD, Registrar, Chief Hostel Warden)
const getAssignedComplaints = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;

    // Only medium-level users can access this
    if (!["hod", "registrar", "chief_hostel_warden"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const complaints = await Complaint.find({ assignedTo: userId })
      .populate("createdBy", "name email role department")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Get assigned complaints error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching complaints",
      error: error.message,
    });
  }
};

// Get all complaints (Director only)
const getAllComplaints = async (req, res) => {
  try {
    const userRole = req.userRole;

    // Only director can access all complaints
    if (userRole !== "director") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Director access required.",
      });
    }

    const complaints = await Complaint.find()
      .populate("createdBy", "name email role department")
      .populate("assignedTo", "name role")
      .populate("escalatedTo", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Get all complaints error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching complaints",
      error: error.message,
    });
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, response } = req.body;
    const userId = req.userId;
    const userRole = req.userRole;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Check if user has permission to update
    const isAssigned = complaint.assignedTo?.toString() === userId;
    const isDirector = userRole === "director";

    if (!isAssigned && !isDirector) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this complaint",
      });
    }

    // Update complaint
    if (status) complaint.status = status;
    if (response) complaint.response = response;

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating complaint",
      error: error.message,
    });
  }
};

// Reject complaint (for medium-level users)
const rejectComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;
    const { reason } = req.body;

    // Only medium-level users can reject
    if (!["hod", "registrar", "chief_hostel_warden"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only HOD, Registrar, or Warden can reject complaints",
      });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Check if user is assigned to this complaint
    if (complaint.assignedTo?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only reject complaints assigned to you",
      });
    }

    // Check if complaint is in Pending status
    if (complaint.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending complaints can be rejected",
      });
    }

    // Reject complaint
    complaint.status = "Rejected";
    if (reason) complaint.response = reason;

    await complaint.save();

    // Log complaint rejection
    await logComplaintAction({
      complaintId: complaint._id,
      action: "rejected",
      performedBy: userId,
      previousStatus: "Pending",
      newStatus: "Rejected",
      remarks: reason || "Complaint rejected by admin",
    });

    // Populate user details for email
    await complaint.populate("createdBy", "name email");

    // Send response immediately
    res.status(200).json({
      success: true,
      message: "Complaint rejected successfully",
      complaint,
    });
  } catch (error) {
    console.error("Reject complaint error:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting complaint",
      error: error.message,
    });
  }
};

// Accept/Confirm complaint (for medium-level users)
const acceptComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    // Only medium-level users can accept
    if (!["hod", "registrar", "chief_hostel_warden"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only HOD, Registrar, or Warden can accept complaints",
      });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Check if user is assigned to this complaint
    if (complaint.assignedTo?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only accept complaints assigned to you",
      });
    }

    // Check if complaint is in Pending status
    if (complaint.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending complaints can be accepted",
      });
    }

    // Accept complaint
    complaint.status = "Accepted";

    await complaint.save();

    // Log complaint acceptance
    await logComplaintAction({
      complaintId: complaint._id,
      action: "accepted",
      performedBy: userId,
      previousStatus: "Pending",
      newStatus: "Accepted",
      remarks: "Complaint accepted by admin",
    });

    // Populate user details for email
    await complaint.populate("createdBy", "name email");

    // Send response immediately
    res.status(200).json({
      success: true,
      message: "Complaint accepted successfully",
      complaint,
    });
  } catch (error) {
    console.error("Accept complaint error:", error);
    res.status(500).json({
      success: false,
      message: "Error accepting complaint",
      error: error.message,
    });
  }
};

// Resolve complaint (for medium-level users)
const resolveComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;
    const { response } = req.body;

    // Only medium-level users and director can resolve
    if (!["hod", "registrar", "chief_hostel_warden", "director"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only HOD, Registrar, Warden or Director can resolve complaints",
      });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Check if user is assigned to this complaint or is director
    const isAssigned = complaint.assignedTo?.toString() === userId;
    const isDirector = userRole === "director";

    if (!isAssigned && !isDirector) {
      return res.status(403).json({
        success: false,
        message: "You can only resolve complaints assigned to you",
      });
    }

    // Check if complaint is Accepted or Escalated before resolving
    if (complaint.status !== "Accepted" && complaint.status !== "Escalated") {
      return res.status(400).json({
        success: false,
        message: "Only accepted or escalated complaints can be resolved",
      });
    }

    // Resolve complaint
    const previousStatus = complaint.status;
    complaint.status = "Completed";
    if (response) complaint.response = response;

    await complaint.save();

    // Log complaint resolution
    await logComplaintAction({
      complaintId: complaint._id,
      action: "resolved",
      performedBy: userId,
      previousStatus: previousStatus,
      newStatus: "Completed",
      remarks: response || "Complaint resolved",
    });

    // Populate user details for email
    await complaint.populate("createdBy", "name email");

    // Send response immediately
    res.status(200).json({
      success: true,
      message: "Complaint completed successfully",
      complaint,
    });
  } catch (error) {
    console.error("Resolve complaint error:", error);
    res.status(500).json({
      success: false,
      message: "Error resolving complaint",
      error: error.message,
    });
  }
};

// Escalate complaint to Director
const escalateComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    // Only medium-level users can escalate
    if (!["hod", "registrar", "chief_hostel_warden"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only HOD, Registrar, or Warden can escalate complaints",
      });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Check if user is assigned to this complaint
    if (complaint.assignedTo?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only escalate complaints assigned to you",
      });
    }

    // Check if complaint is Accepted before escalating
    if (complaint.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted complaints can be escalated",
      });
    }

    // Find director
    const director = await User.findOne({ role: "director" });

    if (!director) {
      return res.status(404).json({
        success: false,
        message: "Director not found",
      });
    }

    // Escalate complaint
    complaint.status = "Escalated";
    complaint.escalatedTo = director._id;

    await complaint.save();

    // Log complaint escalation
    await logComplaintAction({
      complaintId: complaint._id,
      action: "escalated",
      performedBy: userId,
      previousStatus: "Accepted",
      newStatus: "Escalated",
      escalatedTo: director._id,
      remarks: "Complaint escalated to Director",
    });

    // Populate complaint details for email
    await complaint.populate("createdBy", "name email role department");

    // Send response immediately
    res.status(200).json({
      success: true,
      message: "Complaint escalated to Director successfully",
      complaint,
    });
  } catch (error) {
    console.error("Escalate complaint error:", error);
    res.status(500).json({
      success: false,
      message: "Error escalating complaint",
      error: error.message,
    });
  }
};

// Get all complaint logs (Director only)
const getAllLogs = async (req, res) => {
  try {
    const userRole = req.userRole;

    // Only director can access all logs
    if (userRole !== "director") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Director access required.",
      });
    }

    const logs = await ComplaintLog.find()
      .populate("complaint", "title type status createdAt")
      .populate("performedBy", "name email role")
      .populate("assignedTo", "name role")
      .populate("escalatedTo", "name role")
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      logs,
      totalLogs: logs.length,
    });
  } catch (error) {
    console.error("Get all logs error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching logs",
      error: error.message,
    });
  }
};

// Get logs for a specific complaint
const getComplaintLogs = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    // Check if complaint exists
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Check access - user must be creator, assigned to, or director
    const isCreator = complaint.createdBy?.toString() === userId;
    const isAssigned = complaint.assignedTo?.toString() === userId;
    const isDirector = userRole === "director";

    if (!isCreator && !isAssigned && !isDirector) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You don't have permission to view these logs.",
      });
    }

    const logs = await ComplaintLog.find({ complaint: complaintId })
      .populate("performedBy", "name email role")
      .populate("assignedTo", "name role")
      .populate("escalatedTo", "name role")
      .sort({ timestamp: 1 }); // Chronological order

    res.status(200).json({
      success: true,
      logs,
      complaint: {
        id: complaint._id,
        title: complaint.title,
        type: complaint.type,
        status: complaint.status,
      },
    });
  } catch (error) {
    console.error("Get complaint logs error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching complaint logs",
      error: error.message,
    });
  }
};

// Add old complaint manually (for middle-level admins)
const addOldComplaint = async (req, res) => {
  try {
    const { title, description, type, studentName, studentEmail, customDate, status, response } = req.body;
    const adminId = req.userId;

    // Validate input
    if (!title || !description || !type || !studentName || !studentEmail || !customDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate complaint type
    if (!["academic", "hostel", "staff"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint type",
      });
    }

    // Validate status
    const validStatuses = ["Pending", "Accepted", "Rejected", "In Progress", "Resolved", "Escalated", "Completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Parse the custom date
    const complaintDate = new Date(customDate);
    if (isNaN(complaintDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    // Get admin details
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Find or create a user for the student
    let student = await User.findOne({ email: studentEmail });
    if (!student) {
      // Create a temporary user record for historical complaint
      // Default password: student123 (students can change it after first login)
      const hashedPassword = await bcrypt.hash("student123", 10);
      
      student = new User({
        name: studentName,
        email: studentEmail,
        password: hashedPassword,
        role: "student",
        department: "Historical Record",
      });
      await student.save();
    }

    // Create complaint with custom date
    const newComplaint = new Complaint({
      title,
      description,
      type,
      createdBy: student._id,
      assignedTo: adminId,
      status: status || "Completed",
      response: response || "",
      createdAt: complaintDate, // Custom date
    });

    await newComplaint.save();

    // Log the manual addition
    await logComplaintAction({
      complaintId: newComplaint._id,
      action: "manually_added",
      performedBy: adminId,
      newStatus: status || "Completed",
      assignedTo: adminId,
      remarks: `Old complaint added manually by ${admin.name} (${admin.role}). Original date: ${complaintDate.toLocaleDateString()}`,
    });

    // Populate details for response
    await newComplaint.populate("createdBy", "name email role department");
    await newComplaint.populate("assignedTo", "name email role");

    res.status(201).json({
      success: true,
      message: "Old complaint added successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    console.error("Add old complaint error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding old complaint",
      error: error.message,
    });
  }
};

export {
  submitComplaint,
  getMyComplaints,
  getAssignedComplaints,
  getAllComplaints,
  updateComplaintStatus,
  acceptComplaint,
  rejectComplaint,
  resolveComplaint,
  escalateComplaint,
  getAllLogs,
  getComplaintLogs,
  addOldComplaint,
};