const db = require("../config/db");

const getOpenPositions = async () => {

    const [rows] = await db.query(
        `SELECT COUNT(*) AS count
         FROM job_openings
         WHERE status = 'open'`
    );

    return rows[0].count;
};

const getActiveApplications = async () => {

    const [rows] = await db.query(
        `SELECT COUNT(*) AS count
         FROM applications
         WHERE stage IN (
             'Applied',
             'Screening',
             'Interview',
             'Offer'
         )`
    );

    return rows[0].count;
};

// We need the current week's boundaries. I'd use Monday → Sunday.

const getInterviewsThisWeek = async () => {

    const [rows] = await db.query(
        `SELECT COUNT(*) AS count
         FROM interviews
         WHERE scheduled_at >=
             DATE_SUB(
                 CURDATE(),
                 INTERVAL WEEKDAY(CURDATE()) DAY
             )
         AND scheduled_at <
             DATE_ADD(
                 DATE_SUB(
                     CURDATE(),
                     INTERVAL WEEKDAY(CURDATE()) DAY
                 ),
                 INTERVAL 7 DAY
             )`
    );

    return rows[0].count;
};

const getHiresThisMonth = async () => {

    const [rows] = await db.query(
        `SELECT COUNT(*) AS count
         FROM application_history
         WHERE event_type = 'STAGE_CHANGED'
           AND new_stage = 'Hired'
           AND created_at >=
               DATE_FORMAT(
                   CURDATE(),
                   '%Y-%m-01'
               )
           AND created_at <
               DATE_ADD(
                   DATE_FORMAT(
                       CURDATE(),
                       '%Y-%m-01'
                   ),
                   INTERVAL 1 MONTH
               )`
    );

    return rows[0].count;
};

const getApplicationsByJob = async () => {

    const [rows] = await db.query(
        `SELECT
            j.id,
            j.title,
            COUNT(a.id) AS application_count
         FROM job_openings j
         LEFT JOIN applications a
            ON a.job_opening_id = j.id
         WHERE j.status != 'archived'
         GROUP BY
            j.id,
            j.title
         ORDER BY
            application_count DESC,
            j.title ASC`
    );

    return rows;
};

const getApplicationsByStage = async () => {

    const [rows] = await db.query(
        `SELECT
            stage,
            COUNT(*) AS application_count
         FROM applications
         GROUP BY stage
         ORDER BY
            FIELD(
                stage,
                'Applied',
                'Screening',
                'Interview',
                'Offer',
                'Hired',
                'Rejected'
            )`
    );

    return rows;
};

const getApplicationsPerWeek = async () => {

    const [rows] = await db.query(
        `SELECT
            YEARWEEK(
                applied_at,
                1
            ) AS week_key,

            MIN(
                DATE(
                    applied_at -
                    INTERVAL WEEKDAY(applied_at) DAY
                )
            ) AS week_start,

            COUNT(*) AS application_count

         FROM applications

         WHERE applied_at >=
             DATE_SUB(
                 CURDATE(),
                 INTERVAL 3 MONTH
             )

         GROUP BY
             YEARWEEK(applied_at, 1)

         ORDER BY
             week_start ASC`
    );

    return fillMissingWeeks(rows);
};

const fillMissingWeeks = (rows) => {

    const result = [];

    const today = new Date();

    const start = new Date(today);

    start.setMonth(
        start.getMonth() - 3
    );

    start.setDate(
        start.getDate() -
        start.getDay() +
        1
    );

    for (
        let current = new Date(start);
        current <= today;
        current.setDate(
            current.getDate() + 7
        )
    ) {

        const key =
            current.toISOString()
                .slice(0, 10);

        const existing =
            rows.find(
                row =>
                    new Date(row.week_start)
                        .toISOString()
                        .slice(0, 10) === key
            );

        result.push({
            week_start: key,
            application_count:
                existing
                    ? Number(
                        existing.application_count
                    )
                    : 0
        });
    }

    return result;
};

const getDashboard = async () => {

    const [
        openPositions,
        activeApplications,
        interviewsThisWeek,
        hiresThisMonth,
        applicationsByJob,
        applicationsByStage,
        applicationsPerWeek
    ] = await Promise.all([

        getOpenPositions(),

        getActiveApplications(),

        getInterviewsThisWeek(),

        getHiresThisMonth(),

        getApplicationsByJob(),

        getApplicationsByStage(),

        getApplicationsPerWeek()
    ]);

    return {
        summary: {
            openPositions,
            activeApplications,
            interviewsThisWeek,
            hiresThisMonth
        },

        applicationsByJob,

        applicationsByStage,

        applicationsPerWeek
    };
};

module.exports = {
    getDashboard
};