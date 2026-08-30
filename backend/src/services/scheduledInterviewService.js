const db = require("../config/db");

const scheduleInterview = async ({
    applicationId,
    scheduledAt,
    durationMinutes,
    location,
    notes,
    createdBy
}) => {

    if (!scheduledAt) {
        throw new Error(
            "scheduledAt is required"
        );
    }

    const [applications] = await db.query(
        `SELECT id
         FROM applications
         WHERE id = ?`,
        [applicationId]
    );

    if (applications.length === 0) {
        throw new Error(
            "Application not found"
        );
    }

    const duration =
        Number(durationMinutes) || 60;

    if (duration <= 0) {
        throw new Error(
            "Duration must be greater than zero"
        );
    }

    const [result] = await db.query(
        `INSERT INTO interviews
        (
            application_id,
            scheduled_at,
            duration_minutes,
            location,
            notes,
            created_by
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            applicationId,
            scheduledAt,
            duration,
            location || null,
            notes || null,
            createdBy
        ]
    );

    return {
        id: result.insertId,
        applicationId,
        scheduledAt,
        durationMinutes: duration,
        location: location || null,
        notes: notes || null
    };
};

const getApplicationInterviews = async (
    applicationId
) => {

    const [rows] = await db.query(
        `SELECT
            i.id,
            i.scheduled_at,
            i.duration_minutes,
            i.location,
            i.notes,
            i.created_at,
            u.name AS created_by_name
         FROM interviews i
         JOIN users u
           ON u.id = i.created_by
         WHERE i.application_id = ?
         ORDER BY i.scheduled_at ASC`,
        [applicationId]
    );

    return rows;
};

const deleteInterview = async (
    interviewId
) => {

    const [result] = await db.query(
        `DELETE FROM interviews
         WHERE id = ?`,
        [interviewId]
    );

    if (result.affectedRows === 0) {
        throw new Error(
            "Interview not found"
        );
    }
};

module.exports = {
    scheduleInterview,
    getApplicationInterviews,
    deleteInterview
};