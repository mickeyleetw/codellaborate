let host = document.location.origin;
document.addEventListener("DOMContentLoaded", () => {
    loadCODE();
    document.getElementById('button').addEventListener('click', testcode);
    document.getElementById('save-btn').addEventListener('click', saveEditor)
})
//--------------------------------------------------------------------------
async function loadCODE() {
    const editorId = document.location.pathname.split('/')[2];
    const resFromchk = await fetch('/editor/usereditor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "editorID": editorId })
    });
    const jsonFromchk = await checkStatus(resFromchk);
    let code = jsonFromchk.code;
    let title = jsonFromchk.title;
    let ipttitle = document.getElementById('filename');

    if (jsonFromchk.status === 'Exist') {
        ipttitle.setAttribute('value', title);
    }
}
// -----------------------------Runnig Code--------------------------------------------
function testcode() {
    document.getElementById('y-connect-btn').dispatchEvent(new Event('click'));
    setTimeout(()=>{

    let code = getCode();
    console.log(code);

    fetch('/editor/runcode', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',        },
        body: code
    }).then(checkStatus)
        .then(json => {
            const showresult = document.getElementById('consoleResult');
            showresult.innerHTML = null;
            const outputdiv = document.createElement('div');
            outputdiv.setAttribute('class', 'row output');
            if (json['Result'] === '') {
                outputdiv.innerHTML = 'Nothing To Show';
            }
            else {
                outputdiv.innerHTML = json['Result'];
            }
            showresult.appendChild(outputdiv)
            document.getElementById('y-connect-btn').dispatchEvent(new Event('click'));

        }).catch(error => {
            const output = document.getElementsByClassName('output');
            output[0].innerHTML = error.message;
            console.log('Fetch Error: ', error.message);
        })
    },300);
}
// -------------------------------SaveEditor------------------------------------------
async function saveEditor() {
    document.getElementById('y-connect-btn').dispatchEvent(new Event('click'));
    setTimeout(async ()=>{const code = getCode();
    const editorURL = document.location.href;
    const title = document.getElementById('filename').value;
    console.log(title);
    const token = localStorage.getItem('access_token');
    console.log(token);
    document.getElementById('y-connect-btn').dispatchEvent(new Event('click'));
    if (token) {
        const chkuser = await fetch(`${host}/user/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const chkuserres = await checkStatus(chkuser);
        console.log(chkuserres);
        const userID = chkuserres.data.id;
        const pilecontent = {
            'user': userID,
            'code': code,
            'filename': title,
            'fileURL': editorURL,
        };
        console.log(pilecontent);
        await fetch('/editor/saveEditor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pilecontent)
        })
        swal({
            title: "Editor Saved",
            icon: "success",
        })
    } else {
        swal({
            title: "Please Sign In First",
            icon: "error",
        })
    }},300)
}
// -----------------------------Get Code--------------------------------------------
function getCode() {
    let codecontent = document.getElementsByClassName('CodeMirror-line');
    let num = codecontent.length;
    let code = '';
    if (num != 0) {
        for (i = 0; i < num; i++) {
            let lineText = codecontent[i].innerText;
            let endpoint = lineText[Number(lineText.length - 1)];
            let chkconsole = lineText
            if (lineText.charCodeAt(0) === 8203 && lineText.length == 1) { continue; }
            lineText = lineText + '\n';
            code += lineText;
            console.log(code);
        }
    }
    else {
        code = '';
    }
    console.log(code);
    return code;
}

// -----------------------------Set ChatRoom Bottom--------------------------------------------
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
