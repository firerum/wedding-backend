const jwt = require("jsonwebtoken");

const createToken = (user) => {
    const payload = {
        user: {
            id: user.id,
            email: user.email
        }
    };
    const options = {
        expiresIn: "1d"
    };
    return jwt.sign(payload, process.env.TOKEN_SECRET, options);
};

module.exports = createToken;
