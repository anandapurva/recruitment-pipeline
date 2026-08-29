const interviewService = require("../services/interviewService");

const assign = async (req, res) => {

    try {

        const { id } = req.params;
        const { interviewerId } = req.body;

        if (!interviewerId) {
            return res.status(400).json({
                success: false,
                message: "interviewerId is required"
            });
        }

        const result =
            await interviewService.assignInterviewer(
                id,
                interviewerId,
                req.user.id
            );

        res.status(201).json({
            success: true,
            message:
                "Interviewer assigned successfully",
            result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const remove = async (req, res) => {

    try {

        await interviewService.removeInterviewer(
            req.params.id,
            req.params.interviewerId
        );

        res.json({
            success: true,
            message:
                "Interviewer removed successfully"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getPanel = async (req, res) => {

    try {

        const interviewers =
            await interviewService.getPanel(
                req.params.id
            );

        res.json({
            success: true,
            interviewers
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch interview panel"
        });
    }
};

const myApplications = async (req, res) => {

    try {

        const applications =
            await interviewService.getMyApplications(
                req.user.id
            );

        res.json({
            success: true,
            applications
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch assigned applications"
        });
    }
};

const feedback = async (req, res) => {

    try {

        const { feedback } = req.body;

        await interviewService.addFeedback(
            req.params.id,
            req.user.id,
            feedback
        );

        res.status(201).json({
            success: true,
            message:
                "Feedback added successfully"
        });

    } catch (error) {

        res.status(403).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    assign,
    remove,
    getPanel,
    myApplications,
    feedback
};