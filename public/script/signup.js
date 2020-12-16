document.getElementById("signup").addEventListener('click', signup);
// -------------------------------------------------------------------------
function checkStatus(response) {
    if (response.ok) {

        response.json().then((res) =>{
            console.log(res);
        });
        console.log(json);
        return Promise.resolve("Here:" + json);
       
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
// -------------------------------------------------------------------------

function signup() {
    const userData = {
        "name": document.getElementById('exampleInputName1').value,
        "email": document.getElementById('exampleInputEmail1').value,
        "password": document.getElementById('exampleInputPassword1').value,
    }
    fetch('/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    }).then((response) => {
        // let data = await response.json();
        console.log(data);
        console.log(response);
        return response.json();
    }).then(json => {
        const token = json.data.access_token;
        localStorage.setItem('access_token', token);
        window.location.href = "./index.html";
    }).catch(error => {
        console.log('Fetch Error???: ', error);
    })
}