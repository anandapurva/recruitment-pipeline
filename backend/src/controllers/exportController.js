const exportService = require("../services/exportService");

const exportPipeline = async (
    req,
    res
) => {

    try {

        const rows =
            await exportService.getPipelineSnapshot();

        const csv =
            exportService.convertToCsv(rows);

        res.setHeader(
            "Content-Type",
            "text/csv"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="pipeline.csv"'
        );

        res.send(csv);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to export pipeline"
        });
    }
};

module.exports = {
    exportPipeline
};