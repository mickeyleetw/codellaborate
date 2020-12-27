document.getElementById('save-btn').addEventListener('click', saveEditor)
let host = document.location.origin;
// -------------------------------------------------------------------------
function checkStatus(response) {
    if (response.ok) {
        console.log(response);
        return Promise.resolve(response.json());

    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
// -------------------------------SaveEditor------------------------------------------
async function saveEditor() {
    // const token = localStorage.getItem('access_token');
    // const currentHTML = document.documentElement.outerHTML;
    const code = getCode();
    const editorURL = document.location.href;
    const title = document.getElementById('filename').value;
    console.log(title);
    const token = localStorage.getItem('access_token');
    console.log(token);
    if (token) {
        const chkuser = await fetch(`${host}/user/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const chkuserres = await checkStatus(chkuser);
        console.log(chkuserres);
        const userID = chkuserres.data.id;
        const pilecontent = {
            'user': userID,
            'code': code,
            'filename': title,
            'fileURL': editorURL,
        };
        console.log(pilecontent);
        await fetch('/editor/saveEditor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pilecontent)
        })
        swal({
            title: "Editor Saved",
            icon: "success",
        })
        // alert('Editor Saved')
    } else {
        swal({
            title: "Please Sign In First",
            icon: "error",
        })
        // alert('Please Sign In First')
    }
}
// -----------------------------Get Code--------------------------------------------
function getCode() {
    let codecontent = document.getElementsByClassName('CodeMirror-line');
    let num = codecontent.length;
    let code = '';
    if (num != 0) {
        for (i = 0; i < num; i++) {
            let lineText = codecontent[i].innerText;
            let endpoint = lineText[Number(lineText.length - 1)];
            let chkconsole = lineText
            // console.log(endpoint);
            if (lineText.charCodeAt(0) === 8203 && lineText.length == 1) { continue; }
            // if (endpoint != ';') {
            lineText = lineText + '\n';
            // console.log(lineText);
            // }
            code += lineText;
            console.log(code);
        }
    }
    else {
        code = '';
    }
    console.log(code);
    return code;
}
