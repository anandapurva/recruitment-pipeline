const db = require("../config/db");

const assignInterviewer = async (
    applicationId,
    interviewerId,
    recruiterId
) => {

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Check application
        const [applications] = await connection.query(
            `SELECT id
             FROM applications
             WHERE id = ?`,
            [applicationId]
        );

        if (applications.length === 0) {
            throw new Error("Application not found");
        }

        // Check user and role
        const [users] = await connection.query(
            `SELECT id, role
             FROM users
             WHERE id = ?`,
            [interviewerId]
        );

        if (users.length === 0) {
            throw new Error("User not found");
        }

        if (users[0].role !== "interviewer") {
            throw new Error(
                "Only users with the interviewer role can be assigned to applications"
            );
        }

        // Prevent duplicate assignment
        const [existing] = await connection.query(
            `SELECT application_id
             FROM application_interviewers
             WHERE application_id = ?
               AND interviewer_id = ?`,
            [
                applicationId,
                interviewerId
            ]
        );

        if (existing.length > 0) {
            throw new Error(
                "Interviewer is already assigned to this application"
            );
        }

        await connection.query(
            `INSERT INTO application_interviewers
            (
                application_id,
                interviewer_id
            )
            VALUES (?, ?)`,
            [
                applicationId,
                interviewerId
            ]
        );

        await connection.commit();

        return {
            applicationId,
            interviewerId
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();
    }
};

const removeInterviewer = async (
    applicationId,
    interviewerId
) => {

    const [result] = await db.query(
        `DELETE FROM application_interviewers
         WHERE application_id = ?
           AND interviewer_id = ?`,
        [
            applicationId,
            interviewerId
        ]
    );

    if (result.affectedRows === 0) {
        throw new Error(
            "Interviewer is not assigned to this application"
        );
    }
};

// Get application panel
const getPanel = async (applicationId) => {

    const [interviewers] = await db.query(
        `SELECT
            u.id,
            u.name,
            u.email,
            ai.assigned_at
         FROM application_interviewers ai
         JOIN users u
           ON u.id = ai.interviewer_id
         WHERE ai.application_id = ?
         ORDER BY ai.assigned_at`,
        [applicationId]
    );

    return interviewers;
};

// Get an interviewer's applications
const getMyApplications = async (interviewerId) => {

    const [applications] = await db.query(
        `SELECT
            a.id,
            a.candidate_name,
            a.candidate_email,
            a.source,
            a.stage,
            a.applied_at,
            a.stage_changed_at,
            j.id AS job_id,
            j.title AS job_title,
            j.department
         FROM application_interviewers ai
         JOIN applications a
           ON a.id = ai.application_id
         JOIN job_openings j
           ON j.id = a.job_opening_id
         WHERE ai.interviewer_id = ?
         ORDER BY a.updated_at DESC`,
        [interviewerId]
    );

    return applications;
};

// Add an access-check helper
// We'll need to repeatedly check:
// Is this interviewer assigned to this application?

const isAssignedInterviewer = async (
    applicationId,
    interviewerId
) => {

    const [rows] = await db.query(
        `SELECT application_id
         FROM application_interviewers
         WHERE application_id = ?
           AND interviewer_id = ?`,
        [
            applicationId,
            interviewerId
        ]
    );

    return rows.length > 0;
};

// Feedback Service

const addFeedback = async (
    applicationId,
    interviewerId,
    feedback
) => {

    if (!feedback || !feedback.trim()) {
        throw new Error(
            "Feedback cannot be empty"
        );
    }

    const assigned =
        await isAssignedInterviewer(
            applicationId,
            interviewerId
        );

    if (!assigned) {
        throw new Error(
            "You are not assigned to this application"
        );
    }

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [applications] = await connection.query(
            `SELECT id
             FROM applications
             WHERE id = ?
             FOR UPDATE`,
            [applicationId]
        );

        if (applications.length === 0) {
            throw new Error(
                "Application not found"
            );
        }

        /*
         * Feedback is written directly into the immutable
         * history table.
         */
        await connection.query(
            `INSERT INTO application_history
            (
                application_id,
                event_type,
                performed_by,
                feedback
            )
            VALUES (
                ?,
                'FEEDBACK_ADDED',
                ?,
                ?
            )`,
            [
                applicationId,
                interviewerId,
                feedback.trim()
            ]
        );

        await connection.commit();

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();
    }
};

module.exports = {
    assignInterviewer,
    removeInterviewer,
    getPanel,
    getMyApplications,
    isAssignedInterviewer,
    addFeedback
};