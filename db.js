const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', //put your MySQL password here
    database: 'ecrksi'
});

db.connect((err) => {
    if(err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('MySQL database connected');
});

module.exports = db;