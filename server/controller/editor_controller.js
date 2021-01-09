const childProcess = require('child_process');
const url = require('url');
const {selectFromtable, insertEditorID, insertTableset,updateTable, writeCode, runChildProcess, getTime } = require('../model/editor_model.js');
// -------------------------Create New Editor----------------------------------
const createNeweditor = async (req, res) => {
    let editorId;
    //chk if editor id exist or not
    while (true) {
        editorId = (Math.random().toString(36).substr(2, 3) + Date.now().toString(36).substr(4, 3));
        let chkesult = await selectFromtable('*','editor','editorID',editorId);
        if (chkesult.length == 0) { break; }
        else { continue; }
    }
    let editorid = await insertEditorID(editorId);
    return res.json(editorid);
}
// -----------------------------驗證 Editor------------------------------
const verifyEditor = async (req, res) => {
    const editorId = req.params.id;
    let chkesult = await selectFromtable('*','editor','editorID',editorId);
    if (chkesult.length > 0) {
        res.render('neweditor');
    } else 
        res.render('404')
    }

// -----------------------------Run Code------------------------------
const runCode = async (req, res) => {
    let code = req.body;
    try {
        await writeCode(code);
    } catch (err) {
        console.log(err);
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
        res.send(returnerr);
    }
}
// -----------------------------Save Editor------------------------------
const saveEditor = async (req, res) => {
    const userID = req.body.user;
    const code = req.body.code;
    const editorID = (url.parse(req.body.fileURL, true)).pathname.split('/')[2];
    const title = req.body.filename;
    const currentTime = getTime();
    const userEditor = {
        'userID': userID,
        'title': title,
        'saveTime': currentTime,
        'code': code,
        'fileID': `${editorID}`
    };

    let searchresult= await selectFromtable(['userID','fileID'],'userFile','fileID',editorID);
    if (searchresult.length != 0) {
        await updateTable('userFile','title=?,saveTime = ?, code=?','fileID',[title, currentTime, code, editorID]);
        const result = searchresult.find(x => x.userID == userID);
        if (result == undefined) {
            insertTableset('userFile',userEditor);
        }
    } else {
        insertTableset('userFile',userEditor);
    }

    res.send('OK')
}
// -----------------------------user Editor------------------------------
const userEditor = async (req, res) => {
    const editorID = req.body.editorID;

    let searchresult =await selectFromtable('*','userFile','fileID',editorID)
    console.log(searchresult)
    if (searchresult.length != 0) {
        const code = searchresult[0].code;
        const title = searchresult[0].title;
        const returnArr = {
            "status": "Exist",
            "code": code,
            "title": title
        };
        return res.json(returnArr);
    }
    else {git 
        const returnArr = {
            "status": "Non-Exist",
            "code": null,
            "title": null
        };
        return res.json(returnArr);
    }
}
// -----------------------------------------------------------
module.exports = {
    createNeweditor,
    verifyEditor,
    runCode,
    saveEditor,
    userEditor
}
