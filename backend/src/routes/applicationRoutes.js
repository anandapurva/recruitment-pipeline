const express = require("express");

const authenticate =
    require("../middleware/authMiddleware");

const requireRole =
    require("../middleware/roleMiddleware");

const controller =
    require("../controllers/applicationController");

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
    "/applications/:id",
    authenticate,
    requireRole("recruiter", "interviewer"),
    controller.getById
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

module.exports = router;