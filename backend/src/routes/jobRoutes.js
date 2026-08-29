const express = require("express");

const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    archiveJob,
    restoreJob
} = require("../controllers/jobController");

const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

// Create
router.post(
    "/",
    authenticate,
    requireRole("recruiter"),
    createJob
);

// Get all
router.get(
    "/",
    authenticate,
    requireRole("recruiter", "interviewer"),
    getJobs
);

//  Get one
router.get(
    "/:id",
    authenticate,
    requireRole("recruiter", "interviewer"),
    getJobById
);

//  Update
router.put(
    "/:id",
    authenticate,
    requireRole("recruiter"),
    updateJob
);

//  Archive
router.patch(
    "/:id/archive",
    authenticate,
    requireRole("recruiter"),
    archiveJob
);

// Restore
router.patch(
    "/:id/restore",
    authenticate,
    requireRole("recruiter"),
    restoreJob
);

module.exports = router;