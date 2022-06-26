const pool = require("../src/configs/db.config.js");

module.exports = {
    data: {
        first_name: "sadio",
        last_name: "mane",
        email: "mane@gmail.com",
        password: "123456",
        confirm_password: "123456"
    },
    event: {
        name: "jest test",
        venue: "local development, MAC OS",
        date_of_event: "2023-06-24",
        description: "Just a simple test for the code",
        category: "others"
    },
    signIn: {
        email: "julius@gmail.com",
        password: "123456"
    },
    user: async () => {
        const response = await pool.query("SELECT * FROM users WHERE email = $1", [
            "mane@gmail.com"
        ]);
        if (response.rowCount < 0) throw Error("no user exist");
        return { id: response.rows[0].id, email: response.rows[0].email };
    },
    erase: async () => {
        const response = await pool.query("SELECT * FROM events WHERE user_email = $1", ["mane@gmail.com"]);
        return { id: response.rows[0].id, email: response.rows[0].email };
    }
};
