import express from "express";
import {
  submitComplaint,
  getMyComplaints,
  getAssignedComplaints,
  getAllComplaints,
  updateComplaintStatus,
  escalateComplaint,
} from "../controller/complaintController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes - require authentication
router.post("/submit", authenticate, submitComplaint);
router.get("/my-complaints", authenticate, getMyComplaints);
router.get("/assigned", authenticate, authorize("hod", "registrar", "warden"), getAssignedComplaints);
router.get("/all", authenticate, authorize("director"), getAllComplaints);
router.put("/:complaintId/status", authenticate, updateComplaintStatus);
router.put("/:complaintId/escalate", authenticate, authorize("hod", "registrar", "warden"), escalateComplaint);

export default router;
