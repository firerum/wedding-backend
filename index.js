const express = require("express");
const morgan = require("morgan");
const user = require("./src/routes/user.route");

// initialize express
const app = express();

// port number to listen on
const port = 5000 || process.env.PORT;

// middleware
app.use(morgan("dev")); // for logging url requests
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

app.use("/api/v1/users", user);

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});
