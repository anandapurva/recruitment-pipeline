const db = require("../config/db");

const VALID_STAGES = [
    "Applied",
    "Screening",
    "Interview",
    "Offer",
    "Hired",
    "Rejected"
];

const VALID_SORTS = {
    applied_date: "a.applied_at",
    stage: "a.stage",
    last_update: "a.updated_at"
};

const searchApplications = async ({
    userId,
    role,
    search,
    jobId,
    stage,
    source,
    sort,
    order,
    page = 1,
    limit = 10
}) => {

    const conditions = [];
    const params = [];

    let fromClause = `
        FROM applications a
        JOIN job_openings j
            ON j.id = a.job_opening_id
    `;

    if (role === "interviewer") {

        fromClause += `
            JOIN application_interviewers ai
                ON ai.application_id = a.id
        `;

        conditions.push(
            "ai.interviewer_id = ?"
        );

        params.push(userId);
    }

        if (search && search.trim()) {

        conditions.push(`
            (
                a.candidate_name LIKE ?
                OR a.candidate_email LIKE ?
            )
        `);

        const searchValue =
            `%${search.trim()}%`;

        params.push(
            searchValue,
            searchValue
        );
    }

        if (jobId) {

        conditions.push(
            "a.job_opening_id = ?"
        );

        params.push(jobId);
    }

        if (stage) {

        if (!VALID_STAGES.includes(stage)) {
            throw new Error(
                "Invalid stage filter"
            );
        }

        conditions.push(
            "a.stage = ?"
        );

        params.push(stage);
    }

        if (source && source.trim()) {

        conditions.push(
            "a.source = ?"
        );

        params.push(source.trim());
    }

    const whereClause =
    conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

        const sortColumn =
    VALID_SORTS[sort] ||
    VALID_SORTS.last_update;

    const sortOrder =
        order?.toLowerCase() === "asc"
            ? "ASC"
            : "DESC";

                const safePage =
        Math.max(parseInt(page, 10) || 1, 1);

    const safeLimit =
        Math.min(
            Math.max(parseInt(limit, 10) || 10, 1),
            100
        );

    const offset =
        (safePage - 1) * safeLimit;

            const [countRows] = await db.query(
        `
        SELECT COUNT(DISTINCT a.id) AS total
        ${fromClause}
        ${whereClause}
        `,
        params
    );

    const total =
        countRows[0].total;

            const dataParams = [
        ...params,
        safeLimit,
        offset
    ];

    const [applications] = await db.query(
        `
        SELECT
            a.id,
            a.candidate_name,
            a.candidate_email,
            a.source,
            a.stage,
            a.applied_at,
            a.stage_changed_at,
            a.updated_at,

            j.id AS job_id,
            j.title AS job_title,
            j.department

        ${fromClause}

        ${whereClause}

        ORDER BY
            ${sortColumn} ${sortOrder},
            a.id DESC

        LIMIT ?
        OFFSET ?
        `,
        dataParams
    );

        const totalPages =
        Math.ceil(
            total / safeLimit
        );

    return {
        applications,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages
        }
    };
};

module.exports = { searchApplications };