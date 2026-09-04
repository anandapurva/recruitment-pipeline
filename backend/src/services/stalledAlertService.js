const db = require("../config/db");

const ACTIVE_STAGES = [
    "Applied",
    "Screening",
    "Interview",
    "Offer"
];

const getStalledApplications = async () => {

    const [rows] = await db.query(
        `SELECT
            a.id,
            a.candidate_name,
            a.candidate_email,
            a.stage,
            a.stage_started_at,
            j.title AS job_title

         FROM applications a

         JOIN job_openings j
           ON j.id = a.job_opening_id

         WHERE a.stage IN (
             'Applied',
             'Screening',
             'Interview',
             'Offer'
         )

         AND a.stage_started_at <
             DATE_SUB(
                 NOW(),
                 INTERVAL 10 DAY
             )

         ORDER BY
             a.stage_started_at ASC`
    );

    return rows;
};

const createMissingAlerts = async () => {

    await db.query(`
        INSERT INTO stalled_alerts
        (
            application_id,
            stage,
            stage_started_at
        )

        SELECT
            a.id,
            a.stage,
            a.stage_started_at

        FROM applications AS a

        LEFT JOIN stalled_alerts AS sa
            ON sa.application_id = a.id
            AND sa.stage = a.stage
            AND sa.stage_started_at = a.stage_started_at

        WHERE a.stage IN (
            'Applied',
            'Screening',
            'Interview',
            'Offer'
        )

        AND a.stage_started_at <
            DATE_SUB(
                NOW(),
                INTERVAL 10 DAY
            )

        AND sa.id IS NULL

        ON DUPLICATE KEY UPDATE
            application_id = VALUES(application_id)
    `);
};

const getActiveAlerts = async () => {

    await createMissingAlerts();

    const [rows] = await db.query(
        `SELECT
            sa.id,
            sa.application_id,
            sa.stage,
            sa.stage_started_at,
            sa.created_at,

            a.candidate_name,
            a.candidate_email,

            j.title AS job_title

         FROM stalled_alerts sa

         JOIN applications a
           ON a.id = sa.application_id

         JOIN job_openings j
           ON j.id = a.job_opening_id

         WHERE sa.dismissed_at IS NULL

         AND a.stage = sa.stage

         AND a.stage_started_at =
             sa.stage_started_at

         ORDER BY
             sa.stage_started_at ASC`
    );

    return rows;
};

const dismissAlert = async (
    alertId,
    userId
) => {

    const [rows] = await db.query(
        `SELECT
            id,
            application_id,
            stage,
            stage_started_at,
            dismissed_at

         FROM stalled_alerts

         WHERE id = ?`,
        [alertId]
    );

    if (rows.length === 0) {
        throw new Error(
            "Alert not found"
        );
    }

    const alert = rows[0];

    if (alert.dismissed_at) {
        return;
    }

    const [applications] = await db.query(
        `SELECT
            stage,
            stage_started_at
         FROM applications
         WHERE id = ?`,
        [alert.application_id]
    );

    if (applications.length === 0) {
        throw new Error(
            "Application not found"
        );
    }

    const application =
        applications[0];

    if (
        application.stage !==
        alert.stage ||
        String(application.stage_started_at) !==
        String(alert.stage_started_at)
    ) {
        throw new Error(
            "This alert is no longer for the application's current stage"
        );
    }

    await db.query(
        `UPDATE stalled_alerts
         SET
            dismissed_at = NOW(),
            dismissed_by = ?
         WHERE id = ?`,
        [
            userId,
            alertId
        ]
    );
};

const getActiveAlertCount = async () => {

    await createMissingAlerts();

    const [rows] = await db.query(
        `SELECT COUNT(*) AS count

         FROM stalled_alerts sa

         JOIN applications a
           ON a.id = sa.application_id

         WHERE sa.dismissed_at IS NULL

         AND a.stage = sa.stage

         AND a.stage_started_at =
             sa.stage_started_at`
    );

    return rows[0].count;
};

module.exports = {
    getActiveAlerts,
    getActiveAlertCount,
    dismissAlert,
    createMissingAlerts,
    getStalledApplications
};