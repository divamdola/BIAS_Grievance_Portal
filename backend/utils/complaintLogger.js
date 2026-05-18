const ComplaintLog = require("../models/complaintLog");

/**
 * Log complaint action to database
 * @param {Object} params - Logging parameters
 * @param {String} params.complaintId - Complaint ID
 * @param {String} params.action - Action performed
 * @param {String} params.performedBy - User ID who performed action
 * @param {String} params.previousStatus - Previous status (optional)
 * @param {String} params.newStatus - New status (optional)
 * @param {String} params.remarks - Additional remarks (optional)
 * @param {String} params.assignedTo - Assigned to user ID (optional)
 * @param {String} params.escalatedTo - Escalated to user ID (optional)
 */
const logComplaintAction = async ({
  complaintId,
  action,
  performedBy,
  previousStatus = null,
  newStatus = null,
  remarks = null,
  assignedTo = null,
  escalatedTo = null,
}) => {
  try {
    const log = new ComplaintLog({
      complaint: complaintId,
      action,
      performedBy,
      previousStatus,
      newStatus,
      remarks,
      assignedTo,
      escalatedTo,
    });

    await log.save();
    return log;
  } catch (error) {
    console.error("Error logging complaint action:", error);
    // Don't throw error - logging failure shouldn't break the main flow
  }
};

module.exports = { logComplaintAction };