const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const controller = require("../controllers/applicationController");
const canAccessApplication = require("../middleware/applicationAccessMiddleware");
const { getHistory } = require("../controllers/historyController");
const { search } = require("../controllers/applicationSearchController");
const bulkController = require("../controllers/bulkApplicationController");
const { exportPipeline } = require("../controllers/exportController");

const router = express.Router();

router.post(
    "/jobs/:jobId/applications",
    authenticate,
    requireRole("recruiter"),
    controller.create
);

router.get(
    "/jobs/:jobId/applications",
    authenticate,
    requireRole("recruiter"),
    controller.getByJob
);

router.get(
    "/applications",
    authenticate,
    requireRole("recruiter"),
    search
);

router.get(
    "/applications/export",
    authenticate,
    requireRole("recruiter"),
    exportPipeline
);

router.get(
    "/applications/:id",
    authenticate,
    requireRole("recruiter", "interviewer"),
    canAccessApplication,
    controller.getById
);

router.get(
    "/applications/:id/history",
    authenticate,
    requireRole("recruiter", "interviewer"),
    canAccessApplication,
    getHistory
);

router.put(
    "/applications/:id",
    authenticate,
    requireRole("recruiter"),
    controller.update
);

router.patch(
    "/applications/:id/advance",
    authenticate,
    requireRole("recruiter"),
    controller.advance
);

router.patch(
    "/applications/:id/stage",
    authenticate,
    requireRole("recruiter"),
    controller.moveStage
);

router.patch(
    "/applications/:id/reject",
    authenticate,
    requireRole("recruiter"),
    controller.reject
);

router.patch(
    "/applications/:id/reinstate",
    authenticate,
    requireRole("recruiter"),
    controller.reinstate
);

router.post(
    "/applications/bulk/advance",
    authenticate,
    requireRole("recruiter"),
    bulkController.advance
);

router.post(
    "/applications/bulk/reject",
    authenticate,
    requireRole("recruiter"),
    bulkController.reject
);

module.exports = router;