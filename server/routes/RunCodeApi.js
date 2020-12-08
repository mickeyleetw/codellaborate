const fs = require('fs');
const express = require('express');
const childProcess = require('child_process')
const router = express.Router();


router.get('/', (req, res) => {
    res.redirect('../../index.html');
});

router.post('/runcode', async (req, res) => {
12.
    let code = req.body;

    try {
        let resultFile = await writeFile(code);
        console.log(resultFile);
        // res.json(resultS);
    } catch (err) {
        console.log(err);
        // res.json(err);
    }

    try {
        let runresult = await runChildProcess(childProcess, 2000, 10, '../temp/test.js');
        res.send({Result: runresult});
    } catch (err) {
        let errmessage=err.toString().split('\r')[0];
        let returnerr={
            "Result":errmessage+"!!!!"
        }
        // console.log(`Error Message:${err}`);
        res.send(returnerr);
        // res.send(err);
    }
})

// -------------------------------------------------------------------------
function writeFile(code) {
    return new Promise((resolve,rejects)=>{
        fs.writeFile('../temp/test.js', code, function (err) {
            if (err) {rejects(err); }
            else {resolve('Write operation complete.') }
        });
    })
}


// -------------------------------------------------------------------------
function runChildProcess(childProcess, timeLimit, memoryLimit, file) {
    return new Promise((resolve, reject) => {
        console.log("run the code!");
        let path=`--max-old-space-size=${memoryLimit} ${file}`;
        let command = "node " + path;
        console.log(command)
        let workerProcess = childProcess.exec(command);
        console.log(workerProcess.pid);
        let output = ''
        setTimeout(()=> {
            console.log("start to kill");
            workerProcess.exitCode=1;
            console.log(`This is exit reject code: ${workerProcess.exitCode}`)
            reject("This code run too long");
        }, timeLimit)

        workerProcess.on("exit", () => {
            console.log("exit the code successfully")
        });
        workerProcess.stdout.on("data", (data) => {
            
            output += data;
        });
        workerProcess.stderr.on("data", () => {
            err=`This code out of memory of ${memoryLimit} mb`
            // err = data.toString().split('\r')[0];
            resolve(err);
        });
        workerProcess.stdout.on("end", () => {
            console.log(`This is exit resolve code: ${workerProcess.exitCode}`)
            resolve(output);
        });
    });
}

// -------------------------------------------------------------------------


module.exports = router;

