const pool = require("../configs/db.config");
const { validateNewEvent, validateUpdateEvent } = require("../utils/validators");

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
        const { name, venue, description, date_of_event, category, created_at } = value;
        const isExisting = await pool.query("SELECT * FROM events WHERE name = $1", [name]);
        if (isExisting.rowCount > 0) {
            return res.status(409).json({
                status: "failed",
                message: "Event already exists"
            });
        }
        await pool.query(
            "INSERT INTO events(name, venue, description, category, created_at, date_of_event, user_email) VALUES($1, $2, $3, $4, $5, $6, $7)",
            [name, venue, description, category, created_at, date_of_event, user.email]
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
        const { error, value } = validateUpdateEvent(req.body);
        if (error) {
            return res.status(400).json({
                message: "Invalid request data",
                error: error.message
            });
        }
        // check if event exists
        const response = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
        const [event] = response.rows;
        if (response.rowCount < 1) {
            return res.status(404).json({
                message: "Event does not exist!"
            });
        }
        // ensure only the right user can make updates
        if (email !== event.user_email) {
            return res.status(401).json({
                message: "Access denied! Unauthorized access!"
            });
        }
        const {
            name = event.name,
            venue = event.venue,
            description = event.description,
            category = event.category,
            modified,
            date_of_event = event.date_of_event
        } = value;
        await pool.query(
            "UPDATE events SET name = $1, venue = $2, description = $3, modified = $4, category = $5, date_of_event = $6 WHERE id = $7",
            [name, venue, description, modified, category, date_of_event, id]
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
                message: "Access denied! Unauthorized access!"
            });
        }
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
