getUserInformation()
//--------------------------------------------------------------------------
async function getUserInformation() {
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
        getUserProfile(user);
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
            let button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.setAttribute('id', `view${numfile + 1}`);
            button.innerText = 'view';
            td4.appendChild(button)
            tr.appendChild(td4);

            let buttonID = document.getElementById(`view${numfile + 1}`);
            buttonID.addEventListener('click', function () {
                loadfile(jsonFromuserFile[numfile].fileID);
            });
        }

    } else {
        alert('Please Sign In First')
        window.location.href = "./signuplogin.html"
    }
}
// -------------------------------------------------------------------------
function getUserProfile(user) {
    const userName = document.getElementById('name');
    userName.innerText = `${user.name}`;

    const userEmail = document.getElementById('email');
    userEmail.innerText = `${user.email}`;

}
// -------------------------------------------------------------------------
async function loadfile(editorid) { window.location.href = `./editor/${editorid}` }
