const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const controller = require("../controllers/dashboardController");

const router = express.Router();

router.get(
    "/dashboard",
    authenticate,
    requireRole("recruiter"),
    controller.dashboard
);

module.exports = router;