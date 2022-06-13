const pool = require("../configs/db.config");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");

//  @routes /api/v1/users
//  @access GET request
//  @desc retrieve all users
const get_all_users = async (req, res) => {
    try {
        const response = await pool.query("SELECT * FROM users ORDER BY id");
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

//  @routes /api/v1/users/:id
//  @access GET request
//  @desc retrieve user with a given id
const get_single_user = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (response.rowCount < 1) {
            return res.status(404).json({
                message: "user not found!"
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

//  @routes /api/v1/users/register
//  @access POST request
//  @desc register user
const register = async (req, res) => {
    try {
        let { first_name, last_name, email, password } = req.body;
        // check if user already exists
        const isExisting = await pool.query("SELECT email FROM users WHERE email = $1", [email]);
        if (isExisting.rowCount >= 1) {
            return res.status(409).json({
                message: "User already exists. Please login"
            });
        }
        // encrypt the user password before save
        const encryptedPassword = await bcrypt.hash(password, 10);
        password = encryptedPassword;
        const response = await pool.query(
            "INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4)",
            [first_name, last_name, email, password]
        );
        // create token
        const token = createToken(req);
        return res.status(201).json({
            success: true,
            data: response.rows[0],
            token
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: err.message
        });
    }
};

//  @routes /api/v1/users/login
//  @access POST request
//  @desc log in a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: "email and password must not be empty"
            });
        }
        const response = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (response.rowCount < 1) {
            return res.status(404).json({
                message: "User not found!"
            });
        }
        const [loggedInUser] = response.rows;
        const result = await bcrypt.compare(password, loggedInUser.password);
        if (!result) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }
        const token = createToken(req);
        return res.status(200).json({
            success: true,
            data: response.rows,
            token
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: err.message
        });
    }
};

//  @routes /api/v1/users/:id
//  @access PUT request
//  @desc update user details with a given id
const update_user = (req, res) => {
    res.status(200).json({
        success: true,
        message: "user updated successfully"
    });
};

//  @routes /api/v1/users/:id
//  @access DELETE request
//  @desc delete user with a given id
const delete_user = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
        return res.status(204).json({
            success: true,
            message: "deleted successfully",
            data: {}
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
    get_all_users,
    get_single_user,
    register,
    login,
    update_user,
    delete_user
};
