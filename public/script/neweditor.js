chklogin();
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('neweditor').addEventListener('click', newEditor);
    document.getElementById('logout').addEventListener('click',signout)
    loadCODE();
})
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
//--------------------------------------------------------------------------
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response.json());
        console.log(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
//--------------------------------------------------------------------------
async function loadCODE() {
    const editorId = document.location.pathname.split('/')[2];
    const resFromchk = await fetch('/editor/usereditor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "editorID": editorId })
    });
    const jsonFromchk = await checkStatus(resFromchk);
    // console.log(jsonFromchk)
    let code = jsonFromchk.code;
    let title = jsonFromchk.title;
    console.log(title);
    let ipttitle = document.getElementById('filename');
    let codecontent = document.getElementsByClassName('CodeMirror-line');
    let num = codecontent.length;
    let lineText = codecontent[0].innerText;

    // let close = getCode();
    if (jsonFromchk.status === 'Exist') {
        ipttitle.setAttribute('value', title);
        // if (close.length == 0) {
        // if (num ===1 && lineText.charCodeAt(0) === 8203) {
        //     navigator.permissions.query({ name: "clipboard-write" }).then(result => {
        //         if (result.state == "granted" || result.state == "prompt") {
        //             navigator.clipboard.writeText(code).then(() => { alert('Please press Ctrl+v to load previous content') })
        //         }
        //     })
        // }
        // else {
        //     console.log('The Gate still work')
        // }
    }
}
// -----------------------------Get Code--------------------------------------------
// function getCode() {
//     let codecontent = document.getElementsByClassName('CodeMirror-line');
//     let num = codecontent.length;
//     code = [];
//     for (i = 0; i < num; i++) {
//         let lineText = codecontent[i].innerText;
//         if (lineText.charCodeAt(0) === 8203 && lineText.length == 1) { continue; }
//         lineText = lineText + '\n';
//         code += lineText;
//         console.log(code);
//     }
//     return code;
// }
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
// // -----------------------------Set ChatRoom Bottom--------------------------------------------
$(function () {
    var INDEX = 0;
    $("#chat-circle").click(function () {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

    $(".chat-box-toggle").click(function () {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

})
 // -----------------------------Set Copy URL Bottom--------------------------------------------
var $temp = $("<input>");
var $url = $(location).attr('href');
$('.clipboard').on('click', function() {
  $("body").append($temp);
  $temp.val($url).select();
  document.execCommand("copy");
  $temp.remove();
  $(".copytext").text("URL copied!");
})
// -------------------------------------------------------------------------
function signout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    window.location.reload();
    // loadCODE();
    // window.location.href = "../index.html"
}

