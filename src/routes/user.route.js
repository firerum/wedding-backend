const express = require("express");
const router = express.Router();
const auth = require("../middlewares/verifyToken");
const userController = require("../controllers/user.controller");

router.get("/", userController.get_all_users);

// authentication test
router.get("/:id/dashboard", auth, (req, res) => {
    res.status(200).json({
        message: "welcome to the beginning of this app"
    });
});

router.get("/:id", userController.get_single_user);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.put("/:id", auth, userController.update_user);

router.delete("/:id", auth, userController.delete_user);

module.exports = router;
