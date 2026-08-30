const service = require("../services/scheduledInterviewService");

const schedule = async (req, res) => {

    try {

        const result =
            await service.scheduleInterview({
                applicationId: req.params.id,
                scheduledAt:
                    req.body.scheduledAt,
                durationMinutes:
                    req.body.durationMinutes,
                location:
                    req.body.location,
                notes:
                    req.body.notes,
                createdBy:
                    req.user.id
            });

        res.status(201).json({
            success: true,
            message:
                "Interview scheduled successfully",
            interview: result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getForApplication = async (
    req,
    res
) => {

    try {

        const interviews =
            await service.getApplicationInterviews(
                req.params.id
            );

        res.json({
            success: true,
            interviews
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch interviews"
        });
    }
};

const remove = async (
    req,
    res
) => {

    try {

        await service.deleteInterview(
            req.params.id
        );

        res.json({
            success: true,
            message:
                "Interview cancelled successfully"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    schedule,
    getForApplication,
    remove
};