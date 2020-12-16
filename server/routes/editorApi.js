const fs = require('fs');
const he = require('he');
const express = require('express');
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
    // console.log(editorId)
    // let urlcurrent = (new URL(document.location)).searchParams;
    // let editorId = urlcurrent.get(id);

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
    // const editorId = req.query.id;
    // return res.json(editorId);
    // console.log('QQ')
    res.render('neweditor')
})

// --------------------runCodeApi-----------------------------------------------------
router.post('/editor/runcode', async (req, res) => {
    // console.log('QQ');
    // let oldcode = req.body;
    let code = req.body;
    console.log(code);

    try {
        let resultFile = await writeFile(code);
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

// -------------------------------------------------------------------------
function writeFile(code) {
    return new Promise((resolve, rejects) => {
        fs.writeFile('../temp/test.js', code, function (err) {
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
module.exports = router;