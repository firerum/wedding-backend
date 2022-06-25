const app = require("./app");

// port number to listen on
const port = 5000 || process.env.PORT;

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});
