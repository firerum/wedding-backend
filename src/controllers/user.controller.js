const res = require("express/lib/response");

//  @routes /api/v1/users
//  @access GET request
const get_all_users = (req, res) => {
    res.status(200).json({
        success: true,
        data: [],
    });
};


//  @routes /api/v1/users/:id
//  @access GET request
const get_single_user = (req, res) => {
    res.status(200).json({
        success: true,
        data: [],
    });
};


//  @routes /api/v1/users
//  @access POST request
const new_user = (req, res) => {
    res.status(201).json({
        success: true,
        data: [],
    });
};


//  @routes /api/v1/users/:id
//  @access UPDATE request
const update_user = (req, res) => {
    res.status(200).json({
        success: true,
        message: "user updated successfully",
    });
};

//  @routes /api/v1/users/:id
//  @access DELETE request
const delete_user = (req, res) => {
    res.status(204).json({
        success: true,
        data: {},
    });
};

module.exports = {
    get_all_users,
    get_single_user,
    new_user,
    update_user,
    delete_user,
};
