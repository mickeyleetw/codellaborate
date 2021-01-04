const { db,sqlquery } = require('./mysqlcon.js');
//--------------------------------------------------------------------------
async function dropTables() {
    sql = 'DROP TABLE IF EXISTS `userFile`;';
    await sqlquery(sql);
    sql = 'DROP TABLE IF EXISTS `users`,`editor`;';
    await sqlquery(sql);
};
//--------------------------------------------------------------------------
async function createTables() {
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
        code VARCHAR(60000),\
        fileID VARCHAR(255) NOT NULL,\
        PRIMARY KEY(id),\
        FOREIGN KEY(userID) REFERENCES `users`(id),\
        FOREIGN KEY(fileID) REFERENCES `editor`(editorID)\
        )';

    await sqlquery(sql);
}
//--------------------------------------------------------------------------
function createDatebase() {
    const sql = 'CREATE DATABASE JS Online';
    db.query(sql, (err, result) => {
        if (err) { throw err; }
        res.send('Database created');
    });
}
//--------------------------------------------------------------------------
module.exports = {
    dropTables,
    createTables,
    createDatebase
};