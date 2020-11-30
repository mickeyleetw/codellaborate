const cp = require('child_process');

// (async () => {

//     // console.log(result);
//     try {
//         let result = await runchildprocess(cp, 2000, 10);
//         // console.log(result);
//     } catch (err) {
//         console.log(`Error Message:${err}`);
//         return err;
//     }
// })();

function runchildprocess(childProcess, timeLimit, memoryLimit) {
    return new Promise((resolve, rejects) => {
        let child = childProcess.spawn('node', [`--max-old-space-size=${memoryLimit}`, 'hello.js']);

        //Run Code and OutPut Result
        child.stdout.on('data', (data) => {
            console.log(`Result:${data}`);
            resolve(data);
            TimeOutKillCProcess(child, timeLimit);
        });

        //set flag
        let kill = false;
        //Kill Process when memory exceed limit
        child.stderr.on("data", (err) => {
            let errM = err.toString().split('\r')[0];
            // console.log(errM);
            let QQ=child.kill();
            // console.log(QQ);
            // kill = true;
            console.log("out of memory: killing child process...");
            rejects(errM);
        });

    })
}

// use for Time out
function TimeOutKillCProcess(workingProcess, timelimit) {
    setTimeout(() => {
        workingProcess.kill();
        console.log("timeout: killing child process...");
        // console.log("EXECUTION TIMED OUT");
    }, timelimit);
}

module.exports={
    runchildprocess,
    TimeOutKillCProcess
}