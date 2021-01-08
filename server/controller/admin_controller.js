const { createTables,dropTables,createDatebase } = require('../model/admin_model.js');
//--------------------------------------------------------------------------
function createDB(res){
    createDatebase();
    res.send('Database created');
}
//--------------------------------------------------------------------------
function createAlltables(res){
    createTables();
    res.send('All Tables created');
}
//--------------------------------------------------------------------------
function dropAlltables(res){
    dropTables();
    res.send('All Tables dropped');
}
//--------------------------------------------------------------------------
module.exports = {
    createDB,
    createAlltables,
    dropAlltables,

};