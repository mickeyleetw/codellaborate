document.getElementById("signup").addEventListener('click', signup);
// -------------------------------------------------------------------------
function checkStatus(response) {
    console.log("checkSTatus");
    console.log(response);
    if (response.ok) {
        console.log("OKOKKK?");
        return response.json();
        console.log(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
// -------------------------------------------------------------------------
function signup() {
    const userData = {
        "name": document.getElementById('exampleInputName2').value,
        "email": document.getElementById('exampleInputEmail2').value,
        "password": document.getElementById('exampleInputPassword2').value,
    }
    fetch('/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(checkStatus)
    .then(json => {
        console.log("FINISH parse RESPONSE");
        const token = json.data.access_token;
        const name=json.data.user.name;
        localStorage.setItem('access_token', token);
        localStorage.setItem('username', name);
        window.location.href = "/index.html";
    }).catch(error => {
        console.log('Fetch Error???: ', error);
    })
}