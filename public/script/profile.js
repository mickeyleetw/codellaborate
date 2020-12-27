chklogin();
userInformation();
document.getElementById('neweditor').addEventListener('click', newEditor);
document.getElementById('logout').addEventListener('click',signout)
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
// -------------------------------------------------------------------------
async function userInformation() {
    const token = localStorage.getItem('access_token');
    if (token) {
        const resFromProfile = await fetch('/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const jsonFromProfile = await checkStatus(resFromProfile);
        const user = jsonFromProfile.data;
        userProfile(user);
        const resFromuserFile = await fetch('/user/userFile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "token": user.token })
        });
        const jsonFromuserFile = await checkStatus(resFromuserFile);
        // console.log(jsonFromuserFile);
        const table = document.getElementById('userfile');
        for (let numfile = 0; numfile < jsonFromuserFile.length; numfile++) {
            let tr = document.createElement('tr');
            table.appendChild(tr)
            let td1 = document.createElement('td');
            td1.innerText = jsonFromuserFile[numfile].title;
            tr.appendChild(td1);
            let td2 = document.createElement('td');
            td2.innerText = jsonFromuserFile[numfile].saveTime;
            tr.appendChild(td2);
            let td3 = document.createElement('td');
            td3.innerText = jsonFromuserFile[numfile].fileID;
            tr.appendChild(td3);
            let td4 = document.createElement('td');
            let button=document.createElement('button');
            button.setAttribute('type','button');
            button.setAttribute('id',`view${numfile+1}`);
            button.innerText='view';
            td4.appendChild(button)
            tr.appendChild(td4);

            let buttonID=document.getElementById(`view${numfile+1}`);
            buttonID.addEventListener('click',function() {
                loadfile(jsonFromuserFile[numfile].fileID);
            });
        }
        // console.log('done')
        // table.appendChild(tr)
        // let tr = document.createElement('tr');

    } else {
        alert('Please Sign In First')
        window.location.href = "./signuplogin.html"
    }
}
// -------------------------------------------------------------------------
function userProfile(user) {
    const userName = document.getElementById('name');
    userName.innerText = `${user.name}`;

    const userEmail = document.getElementById('email');
    userEmail.innerText = `${user.email}`;

}
// -------------------------------------------------------------------------
function signout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    window.location.href = "./index.html"
}
// -------------------------------------------------------------------------
async function loadfile(editorid) {
    // const IDS = await fetch('/editor/usereditor',  {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ "userID":userid,"editorID": editorid })
    // });
    // const jsonIDS = await checkStatus(IDS);
    // console.log(jsonIDS);
    // if(jsonIDS.status=='Exist'){
        window.location.href=`./editor/${editorid}`
    // }
    // else{
    //     alert('YOU DO NOT HAVE THIS EDITOR')
    // }

    // // console.log('QQ2');
}
// -------------------------------------------------------------------------
async function chklogin(){
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
        let signin=document.getElementById('signin');
        signin.setAttribute("style","display:none");
        let signout = document.getElementById('signout');
        signout.setAttribute("style", "display:true");
        let logout = document.getElementById('logout');
        logout.setAttribute("style", "display:true");
    }
}