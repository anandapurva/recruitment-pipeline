const db = require("../config/db");

const getPipelineSnapshot = async () => {

    const [rows] = await db.query(`
        SELECT
            a.candidate_name,
            a.candidate_email,
            j.title AS job_title,
            a.stage

        FROM applications a

        JOIN job_openings j
            ON j.id = a.job_opening_id

        WHERE a.stage NOT IN (
            'Rejected',
            'Hired'
        )

        ORDER BY
            j.title,
            a.stage,
            a.candidate_name
    `);

    return rows;
};

const escapeCsv = (value) => {

    if (value === null || value === undefined) {
        return "";
    }

    const stringValue =
        String(value);

    if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
    ) {
        return `"${stringValue.replace(
            /"/g,
            '""'
        )}"`;
    }

    return stringValue;
};

const convertToCsv = (rows) => {

    const headers = [
        "Candidate Name",
        "Candidate Email",
        "Job Opening",
        "Stage"
    ];

    const csvRows = [
        headers.join(",")
    ];

    for (const row of rows) {

        csvRows.push([
            escapeCsv(row.candidate_name),
            escapeCsv(row.candidate_email),
            escapeCsv(row.job_title),
            escapeCsv(row.stage)
        ].join(","));
    }

    return csvRows.join("\n");
};

module.exports = {
    getPipelineSnapshot,
    convertToCsv
};