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
    const currentHTML = document.documentElement.outerHTML;
    const editorURL = document.location.href;
    const title = document.getElementById('filename').value;
    console.log(editorURL);
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
            'html': currentHTML,
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
        alert('Editor Saved')
    } else {
        alert('Please Sign In First')
    }
}