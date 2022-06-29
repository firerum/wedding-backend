const passport = require("passport");
const express = require("express");
const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

// callback route to redirect user to.
// this comes along with a code to fetch the user profile on google platform(server)
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    res.redirect(`/api/v1/users/${req.user.id}/dashboard/`);
});

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({ message: "you are now logged out" });
    });
});

module.exports = router;
