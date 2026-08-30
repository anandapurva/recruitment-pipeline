const service = require("../services/bulkApplicationService");

const advance = async (req, res) => {

    try {

        const ids =
            service.validateApplicationIds(
                req.body.applicationIds
            );

        const result =
            await service.bulkAdvance(
                ids,
                req.user.id
            );

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const reject = async (req, res) => {

    try {

        const ids =
            service.validateApplicationIds(
                req.body.applicationIds
            );

        const result =
            await service.bulkReject(
                ids,
                req.user.id
            );

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { advance, reject };