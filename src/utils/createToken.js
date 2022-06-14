const jwt = require("jsonwebtoken");

const createToken = (user) => {
    const payload = {
        firstname: user.first_name,
        email: user.email
    };
    const options = {
        expiresIn: "1d"
    };
    return jwt.sign(payload, process.env.TOKEN_SECRET, options);
};

module.exports = createToken;
