const { Pool } = require("pg");

const pool = new Pool({
  user: "rwuser",
  host: "localhost",
  database: "calendar_todo",
  password: "rwuser123",
  port: 5432
});

module.exports = pool;
