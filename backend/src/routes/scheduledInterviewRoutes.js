const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const canAccessApplication = require("../middleware/applicationAccessMiddleware");
const controller = require("../controllers/scheduledInterviewController");

const router = express.Router();

// Recruiter schedules:
router.post(
    "/applications/:id/interviews",
    authenticate,
    requireRole("recruiter"),
    controller.schedule
);

// Application interviews:
router.get(
    "/applications/:id/interviews",
    authenticate,
    requireRole("recruiter", "interviewer"),
    canAccessApplication,
    controller.getForApplication
);

// Cancel
router.delete(
    "/interviews/:id",
    authenticate,
    requireRole("recruiter"),
    controller.remove
);

module.exports = router;