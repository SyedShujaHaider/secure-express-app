// pool.js
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') }); // or adjust path if .env is elsewhere

const mysql = require('mysql2');

console.log("Connecting to DB with:");
console.log("USER:", process.env.DB_USER);
console.log("PASS:", process.env.DB_PASS ? "Loaded ✅" : "Missing ❌");
console.log("FULL CONFIG:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'testdb',
});

module.exports = pool;

