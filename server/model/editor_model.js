const { sqlquery } = require('./mysqlcon.js');
const moment = require('moment-timezone');
const fs = require('fs');
// -------------------------selectFromtable----------------------------------
async function selectFromtable(selectitems,tableName,specificCol,editorId) {
    const chkeditor = `SELECT ${selectitems} FROM ${tableName} WHERE ${specificCol}=?;`
    let chkesult = await sqlquery(chkeditor, editorId);
    return chkesult;
}
// -------------------------insertkEditorID----------------------------------
async function insertEditorID(editorId) {
    const sqlu = `INSERT INTO editor SET editorID=?;`
    await sqlquery(sqlu, editorId);
    let result = { id: editorId };
    return result;
}
// -------------------------insertUserFile----------------------------------
async function insertTableset(tableName,editor) {
    const sqluserPile = `INSERT INTO ${tableName} SET ?`;
    await sqlquery(sqluserPile, editor);
}
// -------------------------updateUserFile----------------------------------
async function updateTable(tableName,selectitems,specificCol,inputs) {
    const sqluserPile = `UPDATE ${tableName} SET ${selectitems} where ${specificCol}= ?`;
    await sqlquery(sqluserPile,inputs);
}

// -------------------------Write CODE File----------------------------------
function writeCode(code) {
    return new Promise((resolve, rejects) => {
        fs.writeFile('../temp/code.js', code, function (err) {
            if (err) { rejects(err); }
            else { resolve('Write operation complete.') }
        });
    })
}
// -------------------------------------------------------------------------
function runChildProcess(childProcess, timeLimit, memoryLimit, file) {
    return new Promise((resolve, reject) => {
        console.log("run the code!");
        let path = `--max-old-space-size=${memoryLimit} ${file}`;
        let command = "node " + path;
        console.log(command)
        let workerProcess = childProcess.exec(command);
        console.log(workerProcess.pid);
        let output = ''
        setTimeout(() => {
            console.log("start to kill");
            workerProcess.exitCode = 1;
            console.log(`This is exit reject code: ${workerProcess.exitCode}`)
            reject("This code runs too long");
        }, timeLimit)

        workerProcess.on("exit", () => {
            console.log("exit the code successfully")
        });
        workerProcess.stdout.on("data", (data) => {

            output = output + data + '<br>';
        });
        workerProcess.stderr.on("data", (data) => {
            errM = data.toString().split('\r')[0];
            resolve("This code got Something Wrong!!!!");
        });
        workerProcess.stdout.on("end", () => {
            console.log(`This is exit resolve code: ${workerProcess.exitCode}`)
            resolve(output);
        });
    });
}

// -------------------------------------------------------------------------
function getTime() {
    const timestamp = Date.now();
    const currentTime = moment(timestamp).tz("Asia/Taipei").format('YYYY-MM-DD HH:mm:ss');
    return currentTime;
}
// -------------------------------------------------------------------------
module.exports = {
    selectFromtable,
    insertEditorID,
    insertTableset,
    updateTable,
    getTime,
    runChildProcess,
    writeCode,
};