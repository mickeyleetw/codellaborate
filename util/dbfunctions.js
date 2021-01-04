// MySQL 
const mysql = require('mysql');
const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: 'jsonline'
})

function connectDB() {
    db.getConnection((err, connection) => {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection was closed.')
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Database has too many connections.')
            }
            if (err.code === 'ECONNREFUSED') {
                console.error('Database connection was refused.')
            }
        }
        if (connection) {
            console.log('MySQL connected...')
            connection.release()
        }
        return
    })
}

//--------------------------------------------------------------------------
//let sqlquery as a function to return promise objects to set orders
function sqlquery(str, sqlObj) {
    //console.log(str);
    return new Promise((resolve, reject) => {
        db.query(str, sqlObj, (err, results) => {
            // console.log(results);
            if (err) reject(err);
            else resolve(results);
        }
        );
    });
}
//--------------------------------------------------------------------------
module.exports = {
    connectDB,
    sqlquery,
    db
};