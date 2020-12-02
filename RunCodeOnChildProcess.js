const cp = require('child_process');
const p = require('process');
const fs = require('fs');

(async () => {

    // console.log(result);
    try {
        // let resultS = await writeFile(code);
        let result = await runchildprocess(cp,20000);
        // console.log(result);
    } catch (err) {

        console.log(`Error Message:${err}`);
        return err;
    }
})();

function runchildprocess(childProcess, timeLimit, memoryLimit) {
    return new Promise((resolve, rejects) => {
        let child = childProcess.spawn('node', ['hello.js > QQQ.txt'], { shell: true });
        console.log(child.pid)
        // //Run Code and OutPut Result
        // child.stdout.on('data', (data) => {
        //     // tempArr.push(data.toString());
        //     let tmpstr = `Result:${data.toString()}`
        //     let buffer=new Buffer.from(tmpstr,'utf-8');

        //     // buffer.write(tmpstr,'utf-8');
        //     // writerStream.write(data.toString());
        //     // writeFile(code)
        //     str+=buffer.toString();
        //     i++;
        //     console.log(i);
        //     // console.log('QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ');
        //     // resolve(str);
        // child.on('close', function(code) {
        //     console.log('closing code: ' + code);
        // });
        TimeOutKillCProcess(child, timeLimit);
        TimeOutKillCProcess(child, timeLimit);
        // TimeOutKillCProcess(p, child, timeLimit);
        // TimeOutKillCProcess(p,child, timeLimit);
        //     // writerStream.write(tempArr);
        // });

        // child.stdout.on('end',()=>{
        //     console.log('Finished collecting data chunks.');
        //     // resolve(str);
        //     console.log(str);
        //     // resolve(str)
        // });
        // writerStream.end('OutPutFinish');
        // writerStream.on("finish", function () {
        //     console.log("寫入完成。");
        // });
        // writerStream.on("error", function (err) {
        //     console.log(err.stack);
        // });

        //set flag
        // let kill = false;
        // // //Kill Process when memory exceed limit
        // child.stderr.on("data", (err) => {
        //     console.log(err.toString())
        //     let errM = err.toString().split('\r')[0];
        //     // console.log(errM);
        //     child.kill();
        //     console.log("out of memory: killing child process...");
        //     // child.on('SIGHUP',function(){console.log("out of memory: killing child process...");});
        //     // child.exit(0);
        //     // child.exit(0);
        //     // console.log(QQ[0]);
        //     // kill = true;
        //     rejects(errM);
        // });

    })
}

// use for Time out
function TimeOutKillCProcess(workingProcess, timelimit) {
    setTimeout(() => {

        // workingProcess.on('exit', function () {
        //     process.exit()
        // })

        // workingProcess.on('exit', (code) => {
            // console.log(workingProcess.pid);
        //     if (code == 0) {
                workingProcess.kill();
                console.log("timeout: killing child process...");
        //     }
        // })
        // workingProcess.kill('SIGINT');
        // spawn('taskkill',['/pid',workingProcess.pid,'/f','/t']);


        // workingProcess.on('close',()=>{console.log('workingProcess exit')});
        // let QQ = workingProcess.pid;
        // console.log(QQ);

        // process.kill(-QQ);
        // let i=0;
        // console.log(QQ);
        // i++

        // console.log("EXECUTION TIMED OUT");
    }, timelimit);
}

// function writeFile(code) {
//     return new Promise((resolve, rejects) => {
//         fs.writeFile('./temp/test.js', code, function (err) {
//             if (err) { rejects(err); }
//             else { resolve('Write operation complete.') }
//         });
//     })
// }

