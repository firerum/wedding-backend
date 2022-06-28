const passport = require("passport");
const express = require("express");
const router = express.Router();

router.get("/google", passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

// callback route to redirect user to.
// this comes along with a code to fetch the user profile on google platform(server)
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    console.log(req.session)
    res.status(200).json({
        status: "success",
        data: req.user,
        message: "welcome to the wedding app"
    });
});

module.exports = router;
