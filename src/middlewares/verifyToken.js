const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === null || !token) {
        return res.status(401).json({
            status: "failed",
            message: "token is missing"
        });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: "failed",
                message: "token error",
                error: err
            });
        }
        req.user = user;
        next();
    });
};

module.exports = verifyToken;
