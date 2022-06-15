const express = require("express");
const morgan = require("morgan");
const user = require("./src/routes/user.route");
const event = require("./src/routes/event.route");
const cors = require("cors");

// initialize express
const app = express();

// port number to listen on
const port = 5000 || process.env.PORT;

// enable cross origin for dev
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);
// middleware
app.use(morgan("dev")); // for logging url requests
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

app.use("/api/v1/users", user);
app.use("/api/v1/events", event);

app.use((req, res) => {
    res.status(404).json({
        message: "page not found!"
    });
});

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});
