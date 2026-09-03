const express = require("express");

const authenticate =
    require("../middleware/authMiddleware");

const requireRole =
    require("../middleware/roleMiddleware");

const controller =
    require("../controllers/interviewController");

const router = express.Router();

// Recruiter assigns interviewer
router.post(
    "/applications/:id/interviewers",
    authenticate,
    requireRole("recruiter"),
    controller.assign
);

// Recruiter removes interviewer
router.delete(
    "/applications/:id/interviewers/:interviewerId",
    authenticate,
    requireRole("recruiter"),
    controller.remove
);

// View Panel
router.get(
    "/applications/:id/interviewers",
    authenticate,
    requireRole("recruiter", "interviewer"),
    controller.getPanel
);

router.get(
    "/interviewers",
    authenticate,
    requireRole("recruiter"),
    controller.getInterviewers
);

//  Interviewer's assigned applications
router.get(
    "/interviewers/my-applications",
    authenticate,
    requireRole("interviewer"),
    controller.myApplications
);

// Feedback
router.post(
    "/applications/:id/feedback",
    authenticate,
    requireRole("interviewer"),
    controller.feedback
);

module.exports = router;