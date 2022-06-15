const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const auth = require("../middlewares/verifyToken");

router.get("/", auth, eventController.get_all_events);

router.get("/:id", auth, eventController.get_single_event);

router.post("/", auth, eventController.new_event);

router.put("/:id", auth, eventController.update_event);

router.delete("/:id", auth, eventController.delete_event);

module.exports = router;
