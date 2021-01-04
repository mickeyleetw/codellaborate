const { createTables,dropTables,createDatebase } = require('../model/admin_model.js');
//--------------------------------------------------------------------------
function createDB(){
    createDatebase();
    res.send('Database created');
}
//--------------------------------------------------------------------------
function createAlltables(){
    createTables();
    res.send('All Tables created');
}
//--------------------------------------------------------------------------
function dropAlltables(){
    dropTables();
    res.send('All Tables dropped');
}
//--------------------------------------------------------------------------
module.exports = {
    createDB,
    createAlltables,
    dropAlltables,

};