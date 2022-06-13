const pool = require("../configs/db.config");

//  @routes /api/v1/users
//  @access GET request
const get_all_events = async (req, res) => {
    try {
        const response = await pool.query("SELECT * FROM events ORDER BY id");
        return res.status(200).json({
            success: true,
            data: response.rows
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: err.message
        });
    }
};

module.exports = {
    get_all_events
};
