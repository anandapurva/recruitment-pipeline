const db = require("../config/db");

const {
    createApplication,
    advanceApplication,
    moveToStage,
    rejectApplication,
    reinstateApplication
} = require("../services/applicationService");

const create = async (req, res) => {
    try {

        const { jobId } = req.params;

        const applicationId =
            await createApplication(
                jobId,
                req.body,
                req.user.id
            );

        res.status(201).json({
            success: true,
            message: "Application created successfully",
            applicationId
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get applications for a job
const getByJob = async (req, res) => {
    try {

        const { jobId } = req.params;

        const [applications] = await db.query(
            `SELECT
                id,
                candidate_name,
                candidate_email,
                source,
                notes,
                stage,
                applied_at,
                stage_changed_at,
                created_at,
                updated_at
             FROM applications
             WHERE job_opening_id = ?
             ORDER BY applied_at DESC`,
            [jobId]
        );

        res.json({
            success: true,
            applications
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch applications"
        });
    }
};

const getById = async (req, res) => {
    try {

        const { id } = req.params;

        const [applications] = await db.query(
            `SELECT
                a.*,
                j.title AS job_title
             FROM applications a
             JOIN job_openings j
                ON j.id = a.job_opening_id
             WHERE a.id = ?`,
            [id]
        );

        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.json({
            success: true,
            application: applications[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch application"
        });
    }
};

const update = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            candidate_name,
            candidate_email,
            source,
            notes
        } = req.body;

        if (!candidate_name || !candidate_email) {
            return res.status(400).json({
                success: false,
                message:
                    "Candidate name and email are required"
            });
        }

        const [result] = await db.query(
            `UPDATE applications
             SET candidate_name = ?,
                 candidate_email = ?,
                 source = ?,
                 notes = ?
             WHERE id = ?`,
            [
                candidate_name,
                candidate_email,
                source || null,
                notes || null,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.json({
            success: true,
            message: "Application updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update application"
        });
    }
};

const advance = async (req, res) => {
    try {

        const result =
            await advanceApplication(
                req.params.id,
                req.user.id
            );

        res.json({
            success: true,
            message:
                `Application advanced from ${result.oldStage} to ${result.newStage}`,
            result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const moveStage = async (req, res) => {
    try {

        const { stage } = req.body;

        const result =
            await moveToStage(
                req.params.id,
                stage,
                req.user.id
            );

        res.json({
            success: true,
            message:
                `Application moved from ${result.oldStage} to ${result.newStage}`,
            result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const reject = async (req, res) => {
    try {

        const result =
            await rejectApplication(
                req.params.id,
                req.user.id
            );

        res.json({
            success: true,
            message: "Application rejected",
            result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const reinstate = async (req, res) => {
    try {

        const result =
            await reinstateApplication(
                req.params.id,
                req.user.id
            );

        res.json({
            success: true,
            message:
                `Application reinstated to ${result.newStage}`,
            result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    create,
    getByJob,
    getById,
    update,
    advance,
    moveStage,
    reject,
    reinstate
};