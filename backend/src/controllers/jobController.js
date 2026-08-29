const db = require("../config/db");

const createJob = async (req, res) => {
    try {
        const {
            title,
            department,
            description
        } = req.body;

        if (!title || !department) {
            return res.status(400).json({
                success: false,
                message: "Title and department are required"
            });
        }

        const [result] = await db.query(
            `INSERT INTO job_openings
            (title, department, description, status)
            VALUES (?, ?, ?, 'open')`,
            [title, department, description || null]
        );

        const [jobs] = await db.query(
            `SELECT *
             FROM job_openings
             WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Job opening created successfully",
            job: jobs[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create job opening"
        });
    }
};

const getJobs = async (req, res) => {
    try {
        const { includeArchived } = req.query;

        let query = `
            SELECT
                id,
                title,
                department,
                description,
                status,
                created_at,
                updated_at
            FROM job_openings
        `;

        const params = [];

        if (includeArchived !== "true") {
            query += `
                WHERE status != 'archived'
            `;
        }

        query += `
            ORDER BY created_at DESC
        `;

        const [jobs] = await db.query(query, params);

        res.json({
            success: true,
            jobs
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch job openings"
        });
    }
};

const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        const [jobs] = await db.query(
            `SELECT *
             FROM job_openings
             WHERE id = ?`,
            [id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job opening not found"
            });
        }

        res.json({
            success: true,
            job: jobs[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch job opening"
        });
    }
};

const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            department,
            description,
            status
        } = req.body;

        if (!title || !department) {
            return res.status(400).json({
                success: false,
                message: "Title and department are required"
            });
        }

        if (
            status &&
            !["open", "closed", "archived"].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid job status"
            });
        }

        const [existing] = await db.query(
            `SELECT id
             FROM job_openings
             WHERE id = ?`,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job opening not found"
            });
        }

        await db.query(
            `UPDATE job_openings
             SET title = ?,
                 department = ?,
                 description = ?,
                 status = COALESCE(?, status)
             WHERE id = ?`,
            [
                title,
                department,
                description || null,
                status || null,
                id
            ]
        );

        const [jobs] = await db.query(
            `SELECT *
             FROM job_openings
             WHERE id = ?`,
            [id]
        );

        res.json({
            success: true,
            message: "Job opening updated successfully",
            job: jobs[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update job opening"
        });
    }
};

const archiveJob = async (req, res) => {
    try {
        const { id } = req.params;

        const [jobs] = await db.query(
            `SELECT id, status
             FROM job_openings
             WHERE id = ?`,
            [id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job opening not found"
            });
        }

        if (jobs[0].status === "archived") {
            return res.status(400).json({
                success: false,
                message: "Job opening is already archived"
            });
        }

        await db.query(
            `UPDATE job_openings
             SET status = 'archived'
             WHERE id = ?`,
            [id]
        );

        res.json({
            success: true,
            message: "Job opening archived successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to archive job opening"
        });
    }
};

const restoreJob = async (req, res) => {
    try {
        const { id } = req.params;

        const [jobs] = await db.query(
            `SELECT id, status
             FROM job_openings
             WHERE id = ?`,
            [id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job opening not found"
            });
        }

        if (jobs[0].status !== "archived") {
            return res.status(400).json({
                success: false,
                message: "Only archived job openings can be restored"
            });
        }

        await db.query(
            `UPDATE job_openings
             SET status = 'open'
             WHERE id = ?`,
            [id]
        );

        res.json({
            success: true,
            message: "Job opening restored successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to restore job opening"
        });
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    archiveJob,
    restoreJob
};