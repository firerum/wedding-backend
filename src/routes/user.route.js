const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.get_all_users);

router.get("/:id", userController.get_single_user);

router.post("/", userController.new_user);

router.put("/:id", userController.update_user);

router.delete("/:id", userController.delete_user);


module.exports = router;
