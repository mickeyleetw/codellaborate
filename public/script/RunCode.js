// alert('QQ');
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
// -------------------------------------------------------------------------
function runcode() {
    const code = document.getElementById('code').value;
    
    fetch('/admin/test', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: code
    }).then(checkStatus)
    .then(json => {
        const output=document.getElementsByClassName('output');
        output[0].innerHTML=json['Result'];
        // // const runningresult = json;
        console.log(json);
        // // localStorage.setItem('access_token', token);
        // // window.location.href = "./index.html";
    }).catch(error => {
        const output=document.getElementsByClassName('output');
        output[0].innerHTML=error.message;
        // // const runningresult = json;
        // console.log(json);
        console.log('Fetch Error: ', error.message);
    })
}