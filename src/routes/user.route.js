const express = require("express");
const router = express.Router();
const auth = require("../middlewares/verifyToken");
const userController = require("../controllers/user.controller");

// only use google-oauth if token is absent
// otherwise pass the authentication process to a token based-function (middleware)
// TODO this works at the moment but I have no idea if this is the standard
const authCheck = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
        return auth(req, res, next);
    }
    if (!req.user) {
        res.redirect("/api/v1/auth/google");
    } else {
        next();
    }
};

router.get("/", userController.get_all_users);

// authentication test
router.get("/:id/dashboard", authCheck, (req, res) => {
    res.status(200).json({
        message: "welcome to the beginning of this app"
    });
});

router.get("/:id", auth, userController.get_single_user);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/logout", userController.logout);

router.put("/:id", auth, userController.update_user);

router.delete("/:id", userController.delete_user);

module.exports = router;
