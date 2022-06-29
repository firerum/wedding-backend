const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const user = require("./src/routes/user.route");
const event = require("./src/routes/event.route");
const auth = require("./src/routes/auth.route");
const passportSetup = require("./src/middlewares/passport.google");
const passport = require("passport");

// initialize express
const app = express();

// enable cross origin for dev
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

// middlewares
app.use(morgan("dev")); // for logging url requests
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 60 * 8, // 8 hours,
            httpOnly: true
            // secure: true
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());

// all routes
app.use("/api/v1/users", user);
app.use("/api/v1/events", event);
app.use("/api/v1/auth", auth);

app.use((req, res) => {
    res.status(404).json({
        message: "page not found!"
    });
});

module.exports = app;
