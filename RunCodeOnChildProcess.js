const cp = require('child_process');
const p = require('process');
// const psTree = require('ps-tree');
const fs = require('fs');
// const path='aa.txt';

(async () => {

    // try {
        let runresult = await runChildProcess(cp, 2000, 10, '../temp/test.js');
        console.log(runresult)
    //     let returnresult={
    //         "Result":runresult
    //     }
    //     res.send(returnresult);
    // } catch (err) {
    //     let errmessage=err.toString().split('\r')[0];
    //     let returnerr={
    //         "Result":errmessage
    //     }
    //     // console.log(`Error Message:${err}`);
    //     // res.send(returnerr);
    //     // res.send(err);
    // }
})();

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
        workerProcess.stderr.on("data", (data) => {
            errM = data.toString().split('\r')[0];
            // resolve(errM);
            resolve("This code run too long");
        });
        workerProcess.stdout.on("end", () => {
            console.log(`This is exit resolve code: ${workerProcess.exitCode}`)
            resolve(output);
        });
    });
}

function writeFile(code) {
    return new Promise((resolve, rejects) => {
        fs.writeFile('./temp/test.js', code, function (err) {
            if (err) { rejects(err); }
            else { resolve('Write operation complete.') }
        });
    })
}

// function readFile(path) {
//     return new Promise((resolve, rejects) => {
//         fs.readFile(path, 'utf-8', function (err,data) {
//             if (err) { rejects(err); }
//             else { resolve(data) }
//         });
//     })
// }