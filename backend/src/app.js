require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const authenticate = require("./middleware/authMiddleware");
const requireRole = require("./middleware/roleMiddleware");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const scheduledInterviewRoutes = require("./routes/scheduledInterviewRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const stalledAlertRoutes = require("./routes/stalledAlertRoutes");

const app = express();

app.use(
    cors({
        origin: "http://localhost:4200"
    })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", applicationRoutes);
app.use("/api", interviewRoutes);
app.use("/api", scheduledInterviewRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", stalledAlertRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Recruitment Pipeline API is running"
    });
});

app.get(
    "/api/test/recruiter",
    authenticate,
    requireRole("recruiter"),
    (req, res) => {
        res.json({
            success: true,
            message: "Recruiter access granted",
            user: req.user
        });
    }
);

app.get(
    "/api/test/interviewer",
    authenticate,
    requireRole("interviewer"),
    (req, res) => {
        res.json({
            success: true,
            message: "Interviewer access granted",
            user: req.user
        });
    }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

