checkAccessToken();
document.getElementById('signout').addEventListener('click',signout)
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
function checkAccessToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
        fetch('/api/1.0/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(checkStatus)
        .then(json => {
            const user = json.data;
            userProfile(user);
        }).catch(error => {
            console.log('Fetch Error: ', error);
        })
    } else {
        window.location.href = `./signIn.html`
    }
}
// -------------------------------------------------------------------------
function userProfile(user) {
    const userName=document.createElement('div');
    userName.setAttribute('class', 'name');
    userName.innerText=`UserName:${user.name}`;

    const userEmail=document.createElement('div');
    userEmail.setAttribute('class', 'email');
    userEmail.innerText=`UserEmail:${user.email}`;
    
    let profile=document.getElementById('profile-details');
    profile.appendChild(userName);
    profile.appendChild(userEmail);
}
// -------------------------------------------------------------------------
function signout() {
    localStorage.removeItem('access_token');
}