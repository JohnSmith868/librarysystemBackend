var mysql = require('mysql');

// Initialize pool

var pool      =    mysql.createPool({
    connectionLimit : 100,
    host: 'localhost',
    user: 'root',
    password:'',
    port: '3306',
    database: 'agile'
});
module.exports = pool;