const service = require("../services/stalledAlertService");

const getAlerts = async (
    req,
    res
) => {

    try {

        const alerts =
            await service.getActiveAlerts();

        res.json({
            success: true,
            alerts
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to load stalled alerts"
        });
    }
};

const getCount = async (
    req,
    res
) => {

    try {

        const count =
            await service.getActiveAlertCount();

        res.json({
            success: true,
            count
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to load alert count"
        });
    }
};

const dismiss = async (
    req,
    res
) => {

    try {

        await service.dismissAlert(
            req.params.id,
            req.user.id
        );

        res.json({
            success: true,
            message:
                "Alert dismissed successfully"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAlerts,
    getCount,
    dismiss
};