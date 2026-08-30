const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const controller = require("../controllers/stalledAlertController");

const router = express.Router();

router.get(
    "/alerts/stalled",
    authenticate,
    requireRole("recruiter"),
    controller.getAlerts
);

router.get(
    "/alerts/stalled/count",
    authenticate,
    requireRole("recruiter"),
    controller.getCount
);

router.post(
    "/alerts/stalled/:id/dismiss",
    authenticate,
    requireRole("recruiter"),
    controller.dismiss
);

module.exports = router;