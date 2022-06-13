const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === null) {
        return res.json({
            message: "token missing",
        });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "token error",
                error: err.message,
            });
        }
        req.user = user;
        next();
    });
};

module.exports = verifyToken;
