var mysql = require('mysql');

// Initialize pool

var pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.RDS_HOSTNAME || 'localhost',
    user: process.env.RDS_USERNAME || 'root',
    password: process.env.RDS_PASSWORD || '',
    port: '3306',
    database: 'agile'
});
module.exports = pool;