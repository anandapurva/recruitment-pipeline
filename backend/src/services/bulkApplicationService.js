const db = require("../config/db");

const {
    advanceApplication,
    rejectApplication
} = require("./applicationService");


const bulkAdvance = async (
    applicationIds,
    userId
) => {

    const results = {
        succeeded: [],
        failed: []
    };

    for (const applicationId of applicationIds) {

        try {

            const result =
                await advanceApplication(
                    applicationId,
                    userId
                );

            results.succeeded.push({
                id: applicationId,
                ...result
            });

        } catch (error) {

            results.failed.push({
                id: applicationId,
                reason: error.message
            });

        }
    }

    return results;
};


const bulkReject = async (
    applicationIds,
    userId
) => {

    const results = {
        succeeded: [],
        failed: []
    };

    for (const applicationId of applicationIds) {

        try {

            const [rows] = await db.query(
                `SELECT stage
                 FROM applications
                 WHERE id = ?`,
                [applicationId]
            );

            if (rows.length === 0) {
                throw new Error(
                    "Application not found"
                );
            }

            const currentStage =
                rows[0].stage;

            if (currentStage === "Rejected") {
                throw new Error(
                    "Application is already rejected"
                );
            }

            const result =
                await rejectApplication(
                    applicationId,
                    userId
                );

            results.succeeded.push({
                id: applicationId,
                from: currentStage,
                to: "Rejected",
                ...result
            });

        } catch (error) {

            results.failed.push({
                id: applicationId,
                reason: error.message
            });

        }
    }

    return results;
};


const validateApplicationIds = (
    applicationIds
) => {

    if (!Array.isArray(applicationIds)) {
        throw new Error(
            "applicationIds must be an array"
        );
    }

    if (applicationIds.length === 0) {
        throw new Error(
            "At least one application must be selected"
        );
    }

    if (applicationIds.length > 100) {
        throw new Error(
            "A maximum of 100 applications can be processed at once"
        );
    }

    const uniqueIds =
        [...new Set(applicationIds)];

    if (
        uniqueIds.some(
            id => !Number.isInteger(Number(id))
        )
    ) {
        throw new Error(
            "Application IDs must be valid numbers"
        );
    }

    return uniqueIds.map(Number);
};


module.exports = {
    bulkAdvance,
    bulkReject,
    validateApplicationIds
};