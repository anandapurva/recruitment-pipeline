const { searchApplications } = require("../services/applicationSearchService");

const search = async (req, res) => {

    try {

        const result =
            await searchApplications({

                userId: req.user.id,

                role: req.user.role,

                search: req.query.search,

                jobId: req.query.jobId,

                stage: req.query.stage,

                source: req.query.source,

                sort: req.query.sort,

                order: req.query.order,

                page: req.query.page,

                limit: req.query.limit
            });

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { search };