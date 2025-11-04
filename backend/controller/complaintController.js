import Complaint from "../models/complaint.js";
import User from "../models/user.js";

// Submit a new complaint
export const submitComplaint = async (req, res) => {
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
      // Assign to Warden
      const warden = await User.findOne({ role: "warden" });
      if (warden) assignedTo = warden._id;
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

    // Populate creator details for response
    await newComplaint.populate("createdBy", "name email role department");
    await newComplaint.populate("assignedTo", "name email role");

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
export const getMyComplaints = async (req, res) => {
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

// Get complaints assigned to a medium-level user (HOD, Registrar, Warden)
export const getAssignedComplaints = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;

    // Only medium-level users can access this
    if (!["hod", "registrar", "warden"].includes(userRole)) {
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
export const getAllComplaints = async (req, res) => {
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
export const updateComplaintStatus = async (req, res) => {
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

// Escalate complaint to Director
export const escalateComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    // Only medium-level users can escalate
    if (!["hod", "registrar", "warden"].includes(userRole)) {
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
