const db = require("../config/db");

const STAGES = [
    "Applied",
    "Screening",
    "Interview",
    "Offer",
    "Hired"
];

const REJECTED = "Rejected";

const getNextStage = (currentStage) => {
    const index = STAGES.indexOf(currentStage);

    if (index === -1 || index === STAGES.length - 1) {
        return null;
    }

    return STAGES[index + 1];
};

const createApplication = async (
    jobId,
    candidateData,
    userId
) => {

    const {
        candidate_name,
        candidate_email,
        source,
        notes
    } = candidateData;

    if (!candidate_name || !candidate_email) {
        throw new Error(
            "Candidate name and email are required"
        );
    }

    const [jobs] = await db.query(
        `SELECT id, status
         FROM job_openings
         WHERE id = ?`,
        [jobId]
    );

    if (jobs.length === 0) {
        throw new Error("Job opening not found");
    }

    if (jobs[0].status !== "open") {
        throw new Error(
            "Applications can only be added to open job openings"
        );
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            `INSERT INTO applications
            (
                job_opening_id,
                candidate_name,
                candidate_email,
                source,
                notes,
                stage
            )
            VALUES (?, ?, ?, ?, ?, 'Applied')`,
            [
                jobId,
                candidate_name,
                candidate_email,
                source || null,
                notes || null
            ]
        );

        await connection.query(
            `INSERT INTO application_history
            (
                application_id,
                event_type,
                new_stage,
                performed_by
            )
            VALUES (?, 'CREATED', 'Applied', ?)`,
            [result.insertId, userId]
        );

        await connection.commit();

        return result.insertId;

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();
    }
};

const advanceApplication = async (
    applicationId,
    userId
) => {

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [applications] = await connection.query(
            `SELECT *
             FROM applications
             WHERE id = ?
             FOR UPDATE`,
            [applicationId]
        );

        if (applications.length === 0) {
            throw new Error("Application not found");
        }

        const application = applications[0];

        if (application.stage === REJECTED) {
            throw new Error(
                "Rejected applications cannot be advanced. Reinstate the application first."
            );
        }

        const nextStage = getNextStage(
            application.stage
        );

        if (!nextStage) {
            throw new Error(
                "Application is already at the final stage."
            );
        }

        await connection.query(
            `UPDATE applications
             SET stage = ?,
                 stage_changed_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                nextStage,
                applicationId
            ]
        );

        await connection.query(
            `INSERT INTO application_history
            (
                application_id,
                event_type,
                old_stage,
                new_stage,
                performed_by
            )
            VALUES (?, 'STAGE_CHANGED', ?, ?, ?)`,
            [
                applicationId,
                application.stage,
                nextStage,
                userId
            ]
        );

        await connection.commit();

        return {
            applicationId,
            oldStage: application.stage,
            newStage: nextStage
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();
    }
};

const moveToStage = async (
    applicationId,
    targetStage,
    userId
) => {

    if (!STAGES.includes(targetStage)) {
        throw new Error("Invalid target stage");
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [applications] = await connection.query(
            `SELECT *
             FROM applications
             WHERE id = ?
             FOR UPDATE`,
            [applicationId]
        );

        if (applications.length === 0) {
            throw new Error("Application not found");
        }

        const application = applications[0];

        if (application.stage === REJECTED) {
            throw new Error(
                "Rejected applications cannot move stages. Reinstate the application first."
            );
        }

        const expectedNextStage = getNextStage(
            application.stage
        );

        if (targetStage !== expectedNextStage) {
            throw new Error(
                `Invalid stage transition: ${application.stage} can only advance to ${expectedNextStage}.`
            );
        }

        await connection.query(
            `UPDATE applications
             SET stage = ?,
                 stage_changed_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [targetStage, applicationId]
        );

        await connection.query(
            `INSERT INTO application_history
            (
                application_id,
                event_type,
                old_stage,
                new_stage,
                performed_by
            )
            VALUES (?, 'STAGE_CHANGED', ?, ?, ?)`,
            [
                applicationId,
                application.stage,
                targetStage,
                userId
            ]
        );

        await connection.commit();

        return {
            applicationId,
            oldStage: application.stage,
            newStage: targetStage
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();
    }
};

const rejectApplication = async (
    applicationId,
    userId
) => {

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [applications] = await connection.query(
            `SELECT *
             FROM applications
             WHERE id = ?
             FOR UPDATE`,
            [applicationId]
        );

        if (applications.length === 0) {
            throw new Error("Application not found");
        }

        const application = applications[0];

        if (application.stage === REJECTED) {
            throw new Error(
                "Application is already rejected."
            );
        }

        const previousStage = application.stage;

        await connection.query(
            `UPDATE applications
             SET stage = 'Rejected',
                 rejected_from_stage = ?,
                 stage_changed_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                previousStage,
                applicationId
            ]
        );

        await connection.query(
            `INSERT INTO application_history
            (
                application_id,
                event_type,
                old_stage,
                new_stage,
                performed_by
            )
            VALUES (?, 'REJECTED', ?, 'Rejected', ?)`,
            [
                applicationId,
                previousStage,
                userId
            ]
        );

        await connection.commit();

        return {
            applicationId,
            oldStage: previousStage,
            newStage: "Rejected"
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();
    }
};

const reinstateApplication = async (
    applicationId,
    userId
) => {

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [applications] = await connection.query(
            `SELECT *
             FROM applications
             WHERE id = ?
             FOR UPDATE`,
            [applicationId]
        );

        if (applications.length === 0) {
            throw new Error("Application not found");
        }

        const application = applications[0];

        if (application.stage !== REJECTED) {
            throw new Error(
                "Only rejected applications can be reinstated."
            );
        }

        if (!application.rejected_from_stage) {
            throw new Error(
                "Original rejection stage could not be determined."
            );
        }

        const restoredStage =
            application.rejected_from_stage;

        await connection.query(
            `UPDATE applications
             SET stage = ?,
                 rejected_from_stage = NULL,
                 stage_changed_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                restoredStage,
                applicationId
            ]
        );

        await connection.query(
            `INSERT INTO application_history
            (
                application_id,
                event_type,
                old_stage,
                new_stage,
                performed_by
            )
            VALUES (?, 'REINSTATED', 'Rejected', ?, ?)`,
            [
                applicationId,
                restoredStage,
                userId
            ]
        );

        await connection.commit();

        return {
            applicationId,
            oldStage: "Rejected",
            newStage: restoredStage
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();
    }
};

module.exports = {
    createApplication,
    advanceApplication,
    moveToStage,
    rejectApplication,
    reinstateApplication
};