userInformation();
// document.getElementById('signout').addEventListener('click',signout)
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
            // console.log(user.id);
            // console.log(jsonFromuserFile[numfile].fileID);
            buttonID.addEventListener('click',loadfile(user.id,jsonFromuserFile[numfile].fileID));
        }
        // console.log('done')
        // table.appendChild(tr)
        // let tr = document.createElement('tr');

    } else {
        alert('Please Sign In First')
        window.location.href = `./signIn.html`
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
}
// -------------------------------------------------------------------------
async function loadfile(userid,editorid) {
    console.log('QQ');
    const IDS = await fetch('/editor/usereditor',  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "userID":userid,"editorID": editorid })
    });
    const jsonIDS = await checkStatus(IDS);
    console.log(jsonIDS);
    console.log('QQ2');
}