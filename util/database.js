const mysql = require('mysql2');
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database: 'ecommerse',
    password:'0020033'

});
module.exports = pool.promise();
