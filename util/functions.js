// require('../dotenv').config();

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

async function dropTables() {
    sql = 'DROP TABLE IF EXISTS `userFile`;';
    await sqlquery(sql);
    sql = 'DROP TABLE IF EXISTS `users`,`editor`;';
    await sqlquery(sql);
};

async function createAllTables() {
    sql = 'CREATE TABLE IF NOT EXISTS `users`(\
        id int AUTO_INCREMENT,\
        provider ENUM(\'native\', \'facebook\') NOT NULL,\
        name VARCHAR(255),\
        email VARCHAR(255),\
        password VARCHAR(255),\
        token VARCHAR(255),\
        expiry VARCHAR(255),\
        salt VARCHAR(255),\
        PRIMARY KEY(id)\
        )';

    await sqlquery(sql);

    sql = 'CREATE TABLE IF NOT EXISTS `editor`(\
        id int AUTO_INCREMENT,\
        editorID VARCHAR(255) unique NOT NULL,\
        PRIMARY KEY(id)\
        )';

    await sqlquery(sql);

    sql = 'CREATE TABLE IF NOT EXISTS `userFile`(\
        id int AUTO_INCREMENT,\
        userID int NOT NULL,\
        title VARCHAR(255),\
        saveTime VARCHAR(255),\
        fileID VARCHAR(255) NOT NULL,\
        PRIMARY KEY(id),\
        FOREIGN KEY(userID) REFERENCES `users`(id),\
        FOREIGN KEY(fileID) REFERENCES `editor`(editorID)\
        )';

    await sqlquery(sql);

}

//--------------------------------------------------------------------------
module.exports = {
    connectDB,
    sqlquery,
    dropTables,
    createAllTables,
};