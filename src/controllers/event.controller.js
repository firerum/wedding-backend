const pool = require("../configs/db.config");

//  @routes /api/v1/events
//  @access GET request
//  @desc retrieve all events
const get_all_events = async (req, res) => {
    try {
        const response = await pool.query(
            "SELECT * FROM events LEFT JOIN users ON events.user_email = users.email"
        );
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

//  @routes /api/v1/events/:id
//  @access GET request
//  @desc retrieve single event with a given id
const get_single_event = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
        if (response.rowCount < 1) {
            return res.status(404).json({
                message: "event not found!"
            });
        }
        return res.status(200).json({
            success: true,
            data: response.rows
        });
    } catch (err) {
        res.status(200).json({
            success: false,
            message: "server error",
            data: err.message
        });
    }
};

//  @routes /api/v1/events/:id
//  @access POST request
//  @desc create new event
const new_event = async (req, res) => {
    try {
        const { name, venue, description, created_at } = req.body;
        if (!name || !venue || !description) {
            return res.status(400).json({
                message: "fields must not be empty"
            });
        }
        // get the signed in user from the request object passed down by the next function
        const { user } = req;
        await pool.query(
            "INSERT INTO events(name, venue, description, user_email) VALUES($1, $2, $3, $4)",
            [name, venue, description, user.email]
        );
        const response = await pool.query("SELECT * FROM events WHERE name = $1", [name]);
        return res.status(200).json({
            success: true,
            message: "event created successfully",
            data: response.rows
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "server error",
            data: err.message
        });
    }
};

//  @routes /api/v1/events/:id
//  @access PUT request
//  @desc update event details with a given id
const update_event = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, venue, description, created_at } = req.body;
        if (!name || !venue || !description) {
            return res.status(400).json({
                message: "fields cannot be empty"
            });
        }
        // check if event exists
        const response = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
        if (response.rows < 1) {
            return res.status(404).json({
                message: "Event does not exist!"
            });
        }
        // do the update if event exists
        await pool.query("UPDATE events SET name = $1, venue = $2, description = $3 WHERE id = $4", [
            name,
            venue,
            description,
            id
        ]);
        // fetch the updated user
        const updatedEvent = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: updatedEvent.rows
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: err.message
        });
    }
};

//  @routes /api/v1/events/:id
//  @access DELETE request
//  @desc delete event with a given id
const delete_event = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
        // check if event exists
        if (response.rowCount < 1) {
            return res.status(404).json({
                message: "event does not exist!"
            });
        }
        // delete event if it exists
        await pool.query("DELETE FROM events WHERE id = $1", [id]);
        return res.status(200).json({
            success: true,
            message: "deleted successfully"
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
    get_all_events,
    get_single_event,
    new_event,
    update_event,
    delete_event
};
