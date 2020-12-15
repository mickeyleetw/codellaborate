const fs = require('fs');
const express = require('express');
const childProcess = require('child_process')
const router = express.Router();


router.get('/singlecode', (req, res) => {
    res.redirect('/admin/singleCode.html');
});

router.post('/test', async (req, res) => {
    // console.log('QQ');
    let code = req.body;

    try {
        let resultS = await writeFile(code);
        console.log(resultS);
        // res.json(resultS);
    } catch (err) {
        console.log(err);
        // res.json(err);
    }

    try {
        let runresult = await runchildprocess(childProcess, 5000, 10, '../temp/test.js');
        let returnresult={
            "Result":runresult
        }
        res.send(returnresult);
    } catch (err) {
        let errmessage=err.toString().split('\r')[0];
        let returnerr={
            "Result":errmessage
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
function runchildprocess(childProcess, timeLimit, memoryLimit, file) {
    return new Promise((resolve, rejects) => {
        let child = childProcess.spawn('node', [`--max-old-space-size=${memoryLimit}`, `${file}`]);
        TimeOutKillCProcess(child, timeLimit);

        // //Run Code and OutPut Resulttry
        // child.stdout.on('data', (data) => {
        //     let result=data.toString();
        //     // console.log(`Result:${data}`);
        //     TimeOutKillCProcess(child, timeLimit);
        //     resolve(result);
        // });

        //Kill Process when memory exceed limit
        child.stderr.on("data", (err) => {
            let errM = err.toString().split('\r')[0];
            child.kill();
            console.log("out of memory: killing child process...");
            rejects(errM);
        });

    })
}

// -------------------------------------------------------------------------
function TimeOutKillCProcess(workingProcess, timelimit) {
    setTimeout(() => {
        workingProcess.kill();
        console.log("timeout: killing child process...");
        // console.log("EXECUTION TIMED OUT");
    }, timelimit);
}


module.exports = router;