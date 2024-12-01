// db.js
require('dotenv').config();
const mysql = require('mysql2');

// Create a connection to the database
const db = mysql.createConnection({
  host     : process.env.DB_HOST || 'localhost',
  user     : process.env.DB_USER || 'your_db_user',
  password : process.env.DB_PASSWORD || 'your_db_password',
  database : process.env.DB_NAME || 'choir_db',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL Database:', err);
    process.exit(1); // Exit the process with an error code
  } else {
    console.log('Connected to MySQL Database');
  }
});

module.exports = db;
