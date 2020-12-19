const fs = require('fs');
const url = require('url');
const express = require('express');
const moment = require('moment');
const childProcess = require('child_process')
const functions = require('../../util/functions');
const router = express.Router();

// --------------------create New Editor----------------------------------------------
router.post('/', async (req, res) => {
    let editorId = (Math.random().toString(36).substr(2, 3) + Date.now().toString(36).substr(4, 3));
    console.log(editorId)
    let editorURL = `editor?id=${editorId}`
    console.log(editorURL);
    const sqlu = `INSERT INTO editor SET editorID=?;`
    let sqlresult = await functions.sqlquery(sqlu, editorId);
    let result = { id: editorId, url: editorURL }
    return res.json(result);
})

// --------------------驗證 Editor----------------------------------------------
router.get('/check', async (req, res) => {
    const editorId = req.query.id;
    const sqlu = 'SELECT * FROM editor where editorID=?';
    let result = (await functions.sqlquery(sqlu, editorId));
    if (result.length > 0) {
        console.log(editorId)
        return res.json(editorId);
        // return res.redirect(`/editor?id=${editorId}`)
    } else {
        res.redirect('/')
    }
})
// --------------------Render Editor----------------------------------------------
router.get('/', (req, res) => {
    res.render('neweditor')
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
        let runresult = await runChildProcess(childProcess, 5000, 10, '../temp/test.js');
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
    const editorID = (url.parse(req.body.fileURL, true)).query.id
    const title = req.body.filename;
    const currentTime = GetTime();
    // console.log(editorID);

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

    const chkfileID = 'SELECT fileID FROM userFile where fileID=?;'
    let searchresult = await functions.sqlquery(chkfileID, editorID);
    if (searchresult.length != 0) {
        const sqluserPile = `UPDATE userFile SET title=?,saveTime = ? where fileID = ?`;
        let saveResult = await functions.sqlquery(sqluserPile, [title, currentTime, editorID]);
    }
    else {
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
    let searchresult = await functions.sqlquery(chkfileExist, [userID,editorID]);
    console.log(searchresult)
    if (searchresult.length != 0) {
        return res.json(editorID);
        // res.status(200);
    }
    else {
        return res.json('YOU DO NOT HAVE THIS EDITOR!!')
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
        fs.writeFile('../temp/CODE.js', code, function (err) {
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
            // resolve(errM);
            resolve("This code run too long");
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