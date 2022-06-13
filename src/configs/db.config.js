const { Pool } = require("pg");
const config = require("dotenv").config().parsed;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    max: 20,
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 0
});

module.exports = pool;
