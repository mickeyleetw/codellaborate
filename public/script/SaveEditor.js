document.getElementById('save-btn').addEventListener('click', saveEditor);
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
function saveEditor() {
    // const token = localStorage.getItem('access_token');
    const currentHTML = document.documentElement.outerHTML;
    const editorURL = document.location.href;
    const title=document.getElementById('filename').value;
    // console.log(editorURL);
    const token = localStorage.getItem('access_token');
    console.log(token);
    if (token) {
        fetch('user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(checkStatus)
            .then(json => {
                console.log(json);
                const userID = json.data.id;
                const pilecontent = {
                    'user': userID,
                    'html': currentHTML,
                    'filename':title,
                    'fileURL': editorURL,
                };
                // console.log(pilecontent);
                // return pilecontent;

                const res=fetch('/editor/saveEditor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(pilecontent)
                })
                console.log(res);
            })
            .catch(error => {
                console.log('Fetch Error: ', error);
            })
    } else {
        alert('Please Sign In First')
    }
}