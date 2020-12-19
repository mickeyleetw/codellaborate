document.getElementById('signin').addEventListener('click', signin);
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
function signin() {
    const user = {
        "provider": "native",
        "email": document.getElementById('exampleInputEmail1').value,
        "password": document.getElementById('exampleInputPassword1').value,
    }

    fetch('/user/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    }).then(checkStatus)
    .then(json => {
        const token = json.data.access_token; 
        const name=json.data.user.name;
        localStorage.setItem('access_token', token);
        localStorage.setItem('username', name);
        window.location.href = "./index.html";
    }).catch(error => {
        console.log('Fetch Error: ', error);
    })
}