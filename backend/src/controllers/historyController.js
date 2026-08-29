const db = require("../config/db");

const getHistory = async (req, res) => {

    try {

        const { id } = req.params;

        const [history] = await db.query(
            `SELECT
                h.id,
                h.event_type,
                h.old_stage,
                h.new_stage,
                h.feedback,
                h.created_at,
                u.id AS user_id,
                u.name AS user_name,
                u.role AS user_role
             FROM application_history h
             LEFT JOIN users u
               ON u.id = h.performed_by
             WHERE h.application_id = ?
             ORDER BY h.created_at ASC, h.id ASC`,
            [id]
        );

        res.json({
            success: true,
            history
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch application history"
        });
    }
};

module.exports = {
    getHistory
};