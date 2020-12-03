const cp = require('child_process');
const p = require('process');
const psTree = require('ps-tree');
const fs = require('fs');
const path='aa.txt';

(async () => {

    // console.log(result);
    try {
        // let resultS = await writeFile(code);
        let result = await runchildprocess(cp, 10000);
        let consoleFile=fs.statSync('aa.txt');
        let outputsize=consoleFile.size;
        if(outputsize<=Number(10*1024)){
            let output = await readFile(path);
            console.log(output);
            // resolve(output);
        }
        // else{
        //     fs.unlinkSync(path, function(err) {
        //         if (err) throw err;
        //         console.log('file deleted');
        //       });
        // }
        // console.log(result);
    } catch (err) {

        console.log(`Error Message:${err}`);
        return err;
    }
})();

function runchildprocess(childProcess, timeLimit) {
    // '--max-old-space-size=10',
    return new Promise((resolve, rejects) => {
        let child = childProcess.spawn('node', ['--max-old-space-size=5120','hello.js > aa.txt'], { shell: true });

        
        // console.log(child.pid)
        // //Run Code and OutPut Result
        // let str='';
        // child.stdout.on('data', (data) => {
            // tempArr.push(data.toString());
            // let tmpstr = `Result:${data.toString()}`
            // let buffer=new Buffer.from(tmpstr,'utf-8');

            // // buffer.write(tmpstr,'utf-8');
            // // writerStream.write(data.toString());
            // // writeFile(code)
            // str+=tmpstr;
            // i++;
            // console.log(i);
            // resolve(str);
        // child.on('close', function(code) {
        //     console.log('closing code: ' + code);
        // });
        TimeOutKillCProcess(child, timeLimit);
        // TimeOutKillCProcess(child, timeLimit);
        // TimeOutKillCProcess(p, child, timeLimit);
        // TimeOutKillCProcess(p,child, timeLimit);
            // writerStream.write(tempArr);
        // });

        child.stdout.on('end',()=>{
            // console.log('Finished collecting data chunks.');
            // resolve(str);
            // console.log(str);
            resolve('yeah');
        });
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
        child.stderr.on("data", (err) => {
            // console.log(err.toString())
            let errM = err.toString().split('\r')[0];
            // console.log(errM);
            child.kill();
            
            // child.on('SIGHUP',function(){console.log("out of memory: killing child process...");});
            // child.exit(0);
            // child.exit(0);
            // console.log(QQ[0]);
            // kill = true;
            rejects(errM);
            console.log("out of memory: killing child process...");
        });

        // function func1 (err) {
        //     return new Promise((reslve, rejects) => {
        //         let errM = err.toString().split('\r')[0];
        //         console.log("out of memory: killing child process...");
        //         reslve(errM);
        //     })
        // };
        // // console.log(QQ);

        // child.stderr.on("data", func1('aaaa').then((errM) => {
        //     child.kill();
        // }));



        // child.kill();

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

function writeFile(code) {
    return new Promise((resolve, rejects) => {
        fs.writeFile('./temp/test.js', code, function (err) {
            if (err) { rejects(err); }
            else { resolve('Write operation complete.') }
        });
    })
}

function readFile(path) {
    return new Promise((resolve, rejects) => {
        fs.readFile(path, 'utf-8', function (err,data) {
            if (err) { rejects(err); }
            else { resolve(data) }
        });
    })
}