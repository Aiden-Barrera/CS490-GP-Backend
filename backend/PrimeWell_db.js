const mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    database: 'primewell_clinic',
    user: 'root',
    password: '****', //use the password for your machine's workbench
    multipleStatements: true
});

module.exports = conn;