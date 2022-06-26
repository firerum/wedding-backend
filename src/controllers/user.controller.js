const pool = require("../configs/db.config");
const bcrypt = require("bcryptjs");
const createToken = require("../middlewares/createToken");
const { validateRegister, validateLogin, validateUpdateUser } = require("../utils/validators");

//  @routes /api/v1/users
//  @access GET request
//  @desc retrieve all users
const get_all_users = async (req, res) => {
    try {
        const response = await pool.query("SELECT * FROM users ORDER BY id");
        return res.status(200).json({
            status: "success",
            data: response.rows,
            links: {
                hub: {
                    href: "https://wedding-app.com/hub"
                }
            },
            guides: {
                href: "https://wedding-app.com/guides"
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: "Server error",
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
                status: "failed",
                message: "User does not exist!"
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

//  @routes /api/v1/users/register
//  @access POST request
//  @desc register user
const register = async (req, res) => {
    try {
        const { error, value } = validateRegister(req.body);
        if (error) {
            return res.status(400).json({
                message: "Invalid request data",
                error: error.message
            });
        }
        let { first_name, last_name, email, password, created_at } = value;
        const isExisting = await pool.query("SELECT email FROM users WHERE email = $1", [email]);
        if (isExisting.rowCount > 0) {
            return res.status(409).json({
                status: "failed",
                message: "User already exists. Please login"
            });
        }
        // encrypt the user password before save
        const encryptedPassword = await bcrypt.hash(password, 10);
        password = encryptedPassword;
        await pool.query(
            "INSERT INTO users(first_name, last_name, email, password, created_at) VALUES($1, $2, $3, $4, $5)",
            [first_name, last_name, email, password, created_at]
        );
        const response = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const [user] = response.rows;
        const token = createToken(user);
        return res.status(201).json({
            status: "success",
            data: response.rows,
            token
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: "Server error",
            error: err.message
        });
    }
};

//  @routes /api/v1/users/login
//  @access POST request
//  @desc log in a user
const login = async (req, res) => {
    try {
        const { error, value } = validateLogin(req.body);
        if (error) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid request data",
                error: error.message
            });
        }
        const { email, password } = value;
        // check if user exists
        const response = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (response.rowCount < 1) {
            return res.status(404).json({
                status: "failed",
                message: "User does not exist!"
            });
        }
        const [user] = response.rows;
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(400).json({
                status: "failed",
                message: "Incorrect password or email"
            });
        }
        const token = createToken(user);
        return res.status(200).json({
            status: "success",
            data: response.rows,
            token
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: "Server error",
            error: err.message
        });
    }
};

//  @routes /api/v1/users/:id
//  @access PUT request
//  @desc update user details with a given id
const update_user = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        const { error, value } = validateUpdateUser(req.body);
        if (error) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid request data",
                error: error.message
            });
        }
        // ensure only the right user can make updates
        if (id !== user.id) {
            return res.status(401).json({
                status: "failed",
                message: "Access denied! Unauthorized access!"
            });
        }
        // check if user exists
        const response = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const [u] = response.rows;
        if (response.rows < 1) {
            return res.status(404).json({
                status: "success",
                message: "User does not exist!"
            });
        }
        let {
            first_name = u.first_name,
            last_name = u.last_name,
            email = u.email,
            password,
            phone_no,
            country,
            modified = new Date()
        } = value;

        // do the update if user exists
        await pool.query(
            "UPDATE users SET email = $1, first_name= $2, last_name = $3, modified = $4, phone_no = $5, country = $6 WHERE id = $7",
            [email, first_name, last_name, modified, phone_no, country, id]
        );
        const updatedUser = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        return res.status(200).json({
            status: "success",
            message: "User updated successfully",
            data: updatedUser.rows
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: "Server error",
            error: err.message
        });
    }
};

//  @routes /api/v1/users/:id
//  @access DELETE request
//  @desc delete user with a given id
const delete_user = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        if (id !== user.id) {
            return res.status(401).json({
                status: "failed",
                message: "Access denied! Unauthorized access!"
            });
        }
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
        return res.status(200).json({
            status: "success",
            message: "User deleted successfully"
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
    get_all_users,
    get_single_user,
    register,
    login,
    update_user,
    delete_user
};
