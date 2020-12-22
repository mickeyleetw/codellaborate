const fs = require('fs');
const url = require('url');
const express = require('express');
const moment = require('moment');
const childProcess = require('child_process')
const functions = require('../../util/functions');
const router = express.Router();

// --------------------Create New Editor----------------------------------------------
router.post('/', async (req, res) => {
    let chk = false;
    let editorId;
    //check if editor ID exist or not
    while (!chk) {
        editorId = (Math.random().toString(36).substr(2, 3) + Date.now().toString(36).substr(4, 3));
        const chkeditor = `SELECT * FROM editor WHERE editorID=?;`
        let chkesult = await functions.sqlquery(chkeditor, editorId);
        if (chkesult.length == 0) { break; }
        else { continue; }
    }
    // console.log(editorId)
    let editorURL = `editor?id=${editorId}`
    // console.log(editorURL);
    const sqlu = `INSERT INTO editor SET editorID=?;`
    let sqlresult = await functions.sqlquery(sqlu, editorId);
    let result = { id: editorId, url: editorURL }
    return res.json(result);
})
// --------------------驗證 Editor----------------------------------------------
router.get('/:id', async (req, res) => {
    const editorId = req.params.id;
    const sqlu = 'SELECT * FROM editor where editorID=?';
    let result = (await functions.sqlquery(sqlu, editorId));
    console.log(result);
    if (result.length > 0) {
        res.render('neweditor');
    } else {
        res.render('404')
        // res.send('EDITOR NOT EXIST!')
    }
})
// --------------------Run Code-----------------------------------------------------
router.post('/runcode', async (req, res) => {
    // console.log('QQ');
    // let oldcode = req.body;
    let code = req.body;
    console.log(code);

    try {
        let resultFile = await writeCODE(code);
        console.log(resultFile);
        // res.json(resultS);
    } catch (err) {
        console.log(err);
        // res.json(err);
    }

    try {
        let runresult = await runChildProcess(childProcess, 5000, 10, '../temp/code.js');
        let returnresult = {
            "Result": runresult
        }
        res.send(returnresult);
    } catch (err) {
        let errmessage = err.toString().split('\r')[0];
        let returnerr = {
            "Result": errmessage
        }
        // console.log(`Error Message:${err}`);
        res.send(returnerr);
        // res.send(err);
    }
})

// --------------------Save Current Editor-----------------------------------------------------
router.post('/saveEditor', async (req, res) => {
    const userID = req.body.user;
    const currentHTML = req.body.html;
    const editorID = (url.parse(req.body.fileURL, true)).pathname.split('/')[2];
    const title = req.body.filename;
    const currentTime = GetTime();
    console.log(editorID);

    try {
        let resultFile = await writeHTML(currentHTML, editorID);
        console.log(resultFile);
    } catch (err) {
        console.log(err);
    }
    // userEditor Arr
    const userEditor = {
        'userID': userID,
        'title': title,
        'saveTime': currentTime,
        'fileID': `${editorID}`
    };

    const chkfileID = 'SELECT userID,fileID FROM userFile where fileID=?;'
    let searchresult = await functions.sqlquery(chkfileID, editorID);
    console.log(searchresult)
    if (searchresult.length != 0) {
        const sqluserPile = `UPDATE userFile SET title=?,saveTime = ? where fileID = ?`;
        let saveResult = await functions.sqlquery(sqluserPile, [title, currentTime, editorID]);
        const result = searchresult.find(x => x.userID == userID);
        // console.log(result);
        if (result==undefined) {
            const sqluserPile = 'INSERT INTO `userFile` SET ?';
            let saveResult = await functions.sqlquery(sqluserPile, userEditor);
        }
    } else {
        const sqluserPile = 'INSERT INTO `userFile` SET ?';
        let saveResult = await functions.sqlquery(sqluserPile, userEditor);
    }

    res.send('OK')
})
// --------------------Reload saved Editor-----------------------------------------------------
router.post('/usereditor', async (req, res) => {
    const editorID = req.body.editorID;
    const userID = req.body.userID;
    console.log(editorID);
    console.log(userID);

    const chkfileExist = 'SELECT * FROM userFile where userID=? AND fileID=?;'
    let searchresult = await functions.sqlquery(chkfileExist, [userID, editorID]);
    console.log(searchresult)
    if (searchresult.length != 0) {
        const returnArr = {
            "status": "Exist",
            "editorID": editorID
        };
        return res.json(returnArr);
        // return res.redirect(`./pile/${editorID}.html`);
    }
    else {
        const returnArr = {
            "status": "Non-Exist",
            "editorID": null
        };
        return res.json(returnArr);
    }

})

// -------------------------Write HTML File------------------------------------------------
function writeHTML(html, id) {
    return new Promise((resolve, rejects) => {
        fs.writeFile(`./public/pile/${id}.html`, html, function (err) {
            if (err) { rejects(err); }
            else { resolve('Write operation complete.') }
        });
    })
}
// -------------------------Write CODE File------------------------------------------------
function writeCODE(code) {
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
            reject("This code run too long");
        }, timeLimit)

        workerProcess.on("exit", () => {
            console.log("exit the code successfully")
        });
        workerProcess.stdout.on("data", (data) => {

            output = output + data + '<br>';
            // console.log(output)
        });
        workerProcess.stderr.on("data", (data) => {
            errM = data.toString().split('\r')[0];
            resolve(errM);
            // resolve("This code run too long");
        });
        workerProcess.stdout.on("end", () => {
            console.log(`This is exit resolve code: ${workerProcess.exitCode}`)
            // console.log(output)
            resolve(output);
        });
    });
}

// -------------------------------------------------------------------------
function GetTime() {
    const timestamp = moment().format();
    const currentTime = moment(timestamp).format('YYYY-MM-DDTHH:mm:ss.SSS');
    return currentTime;
}
// -------------------------------------------------------------------------
function GetToken() {
    const authorization = req.get('authorization');
    if (authorization) {
        const token = authorization.split(' ')[1];
        return token;
    } else {
        res.status(400).send('No access token.')
    }
}

// -------------------------------------------------------------------------
module.exports = router;