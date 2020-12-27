// alert('QQ');
let urlcurrent = (new URL(document.location))
console.log(urlcurrent)
document.getElementById('neweditor').addEventListener('click', newEditor);
document.getElementById('createneweditor').addEventListener('click', newEditor);
document.getElementById('logout').addEventListener('click',signout)
chklogin();
// FetchDetails(id, rednerDetails);

//--------------------------------------------------------------------------
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response.json());
        // console.log(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
//--------------------------------------------------------------------------
async function newEditor() {
    fetch('/editor', { method: 'POST' })
        .then(checkStatus)
        .then(async json => {
            const id = json.id;
            //get editor/:id API
            window.location.href = `/editor/${id}`;
        })
        .catch(error => {
            console.log('Fetch Error: ', error);
        })
}
//--------------------------------------------------------------------------
async function chklogin() {
    const token = localStorage.getItem('access_token');
    if (token) {
        const resFromProfile = await fetch('/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const jsonFromProfile = await checkStatus(resFromProfile);
        // const user = jsonFromProfile.data;
        // userProfile(user);
        let signin = document.getElementById('signin');
        signin.setAttribute("style", "display:none");
        let signout = document.getElementById('signout');
        signout.setAttribute("style", "display:true");
        let logout = document.getElementById('logout');
        logout.setAttribute("style", "display:true");
    }
}
// -------------------------------------------------------------------------
function signout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    window.location.href = "./index.html"
}