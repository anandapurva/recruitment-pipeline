require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const authenticate = require("./middleware/authMiddleware");
const requireRole = require("./middleware/roleMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

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

