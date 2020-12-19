
document.getElementById('button').addEventListener('click', runcode);
// -------------------------------------------------------------------------
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response.json());
        console.log(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
// -----------------------------Runnig Code--------------------------------------------
function runcode() {
    // const code = document.getElementsByClassName('CodeMirror cm-s-monokai')[0].value;
    // let code=editor.value;
    // console.log(code);
    let code = getCode();
    // console.log(code);

    fetch('/editor/runcode', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: code
    }).then(checkStatus)
        .then(json => {
            const output = document.getElementsByClassName('output');
            output[0].innerHTML = json['Result'];
            // // const runningresult = json;
            console.log(json['Result']);
            // // localStorage.setItem('access_token', token);
            // // window.location.href = "./index.html";
        }).catch(error => {
            const output = document.getElementsByClassName('output');
            output[0].innerHTML = error.message;
            // // const runningresult = json;
            // console.log(json);
            console.log('Fetch Error: ', error.message);
        })
}
// -----------------------------Get Code--------------------------------------------
function getCode() {
    let codecontent = document.getElementsByClassName('CodeMirror-line');
    let num = codecontent.length;
    code = [];
    for (i = 0; i < num; i++) {
        let lineText = codecontent[i].innerText;
        console.log(lineText);
        if (lineText.charCodeAt(0) === 8203 && lineText.length == 1) {
            // console.log('skipped');
            continue;
        }
        else { code += lineText ; }
        // code += lineText+'\n';
    }
    console.log(code);
    return code;

}
