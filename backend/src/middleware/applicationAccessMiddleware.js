const db = require("../config/db");

const canAccessApplication = async (
    req,
    res,
    next
) => {

    try {

        if (req.user.role === "recruiter") {
            return next();
        }

        const applicationId =
            req.params.id;

        const [rows] = await db.query(
            `SELECT application_id
             FROM application_interviewers
             WHERE application_id = ?
               AND interviewer_id = ?`,
            [
                applicationId,
                req.user.id
            ]
        );

        if (rows.length === 0) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not assigned to this application"
            });
        }

        next();

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to verify application access"
        });
    }
};

module.exports = canAccessApplication;