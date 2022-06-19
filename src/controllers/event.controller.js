const pool = require("../configs/db.config");
const { validateNewEvent } = require("../utils/validators");

//  @routes /api/v1/events
//  @access GET request
//  @desc retrieve all events
const get_all_events = async (req, res) => {
    try {
        const { email } = req.user;
        const response = await pool.query("SELECT * FROM events WHERE user_email = $1", [email]);
        return res.status(200).json({
            status: "success",
            data: response.rows
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: "Server error",
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
        const { email } = req.user;
        const response = await pool.query(
            "SELECT * FROM events WHERE id = $1 AND user_email = $2",
            [id, email]
        );
        if (response.rowCount < 1) {
            return res.status(404).json({
                message: "Event does not exist!"
            });
        }
        return res.status(200).json({
            status: "success",
            data: response.rows
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: "Server error",
            error: err.message
        });
    }
};

//  @routes /api/v1/events/:id
//  @access POST request
//  @desc create new event
const new_event = async (req, res) => {
    try {
        const { user } = req;
        const { error, value } = validateNewEvent(req.body);
        if (error) {
            return res.status(400).json({
                message: "Invalid request data",
                error: error.message
            });
        }
        const { name, venue, description, created_at } = value;
        await pool.query(
            "INSERT INTO events(name, venue, description, user_email) VALUES($1, $2, $3, $4)",
            [name, venue, description, user.email]
        );
        const response = await pool.query("SELECT * FROM events WHERE name = $1", [name]);
        return res.status(200).json({
            status: "success",
            message: "Event created successfully",
            data: response.rows
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: "Server error",
            error: err.message
        });
    }
};

//  @routes /api/v1/events/:id
//  @access PUT request
//  @desc update event details with a given id
const update_event = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.user;
        const { name, venue, description, created_at } = req.body;
        if (!name || !venue || !description) {
            return res.status(400).json({
                message: "fields cannot be empty"
            });
        }
        // check if event exists
        const response = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
        const [event] = response.rows;
        if (response.rows < 1) {
            return res.status(404).json({
                message: "Event does not exist!"
            });
        }
        // check if loggedIn user matches the event creator
        if (email !== event.user_email) {
            return res.status(401).json({
                message: "Unauthorized access!"
            });
        }
        // do the update if event exists
        await pool.query(
            "UPDATE events SET name = $1, venue = $2, description = $3, created_at = $4 WHERE id = $5",
            [name, venue, description, created_at, id]
        );
        // fetch the updated user
        const updatedEvent = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
        return res.status(200).json({
            status: "success",
            message: "Event updated successfully",
            data: updatedEvent.rows
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: "Server error",
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
        const { email } = req.user;
        const response = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
        const [event] = response.rows;
        // check if event exists
        if (response.rowCount < 1) {
            return res.status(404).json({
                message: "Event does not exist!"
            });
        }
        // check if loggedIn user matches the event creator hence can delete
        if (email !== event.user_email) {
            return res.status(401).json({
                message: "Unauthorized access!"
            });
        }
        // delete event if it exists
        await pool.query("DELETE FROM events WHERE id = $1", [id]);
        return res.status(200).json({
            status: "success",
            message: "Event Deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: "Server error",
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
