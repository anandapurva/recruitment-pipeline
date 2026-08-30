const {
    getDashboard
} = require("../services/dashboardService");

const dashboard = async (
    req,
    res
) => {

    try {

        const data =
            await getDashboard();

        res.json({
            success: true,
            ...data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to load dashboard"
        });
    }
};

module.exports = {
    dashboard
};