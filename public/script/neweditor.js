chklogin();
loadCODE();
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
    console.log(code);
    let close = getCode();
    if (jsonFromchk.status = 'Exist') {
        if (close.length == 0) {
            // const premissions= await navigator.permissions.query({ name: "clipboard-write" });
            // const res= await checkStatus(premissions);
            // console.log(res);
            // let event = new Event("paste");
            // event.clipboardData = clipboardData;
            // let domelement = document.getElementsByClassName('CodeMirror-scroll');
            // domelement.dispatchEvent(event);


            navigator.permissions.query({ name: "clipboard-write" }).then(result => {
                if (result.state == "granted" || result.state == "prompt") {
                    navigator.clipboard.writeText(code).then(result => {
                        // console.log(checkStatus(result));
                        // alert('Please press Ctrl+v to load previous content')
                        // navigator.clipboard.readText().then(text => {
                            // let codecontent = document.getElementsByClassName('CodeMirror-line');
                            // codecontent.innerText=text;
                            // let event = new Event("paste");
                            // event.clipboardData=text;
                            // let domelement=document.getElementById('editor')
                            // let domelement = document.getElementsByClassName('CodeMirror-code')[0];
                            // domelement.innerText=text;
                            // document.dispatchEvent(event);
                            console.log(5)
                            // console.log('Pasted text: ', text);
                        })
                    // })
                    // let domelement = document.getElementsByClassName('CodeMirror-scroll')[0];
                    // const data = await navigator.clipboard.readText();
                    // console.log(data);
                    // domelement.addEventListener('paste', event => {
                    // //     event.preventDefault();
                    //     // navigator.clipboard.readText().then(text => {
                    //     //     console.log('Pasted text: ', text);
                    //     });
                    console.log(1)
                    // let event = new Event("paste");
                    // console.log(2)
                    // console.log(window.clipboardData.getData('Text'))
                    // event.clipboardData = window.clipboardData;
                    console.log(3)
                    // // te.dispatchEvent(event);
                    // domelement.dispatchEvent(event);
                    console.log(4)
                    // });
                    console.log('OKOK')
                }
            })
            // function directCopy(str) {
            //     document.oncopy = function (event) {
            //         event.clipboardData.setData("Text", str);
            //         event.preventDefault();
            //     };
            //     document.execCommand("Copy");
            //     document.oncopy = undefined;
            // }


            // directCopy("console.log('QQ')");

            // async ()=>{
            // try {
            //     // window.focus();
            // let QQ=await 
            // navigator.clipboard.writeText('QQ').then(result => console.log(result));
            // console.log(QQ)
            // console.log("OKOKOK");
            // }catch(err){
            //     console.log(err);
            //     console.log("NG");
            // }

            // }
            // console.log(jsonFromchk.code);
        }
        else {
            console.log('The Gate still work')
            // continue;
        }
    }
}
// -----------------------------Get Code--------------------------------------------
function getCode() {
    let codecontent = document.getElementsByClassName('CodeMirror-line');
    let num = codecontent.length;
    code = [];
    for (i = 0; i < num; i++) {
        let lineText = codecontent[i].innerText;
        let endpoint = lineText[Number(lineText.length - 1)];
        let chkconsole = lineText
        // console.log(endpoint);
        if (lineText.charCodeAt(0) === 8203 && lineText.length == 1) { continue; }
        // if (endpoint != ';') {
        lineText = lineText + '\n';
        // console.log(lineText);
        // }
        code += lineText;
        console.log(code);
    }
    // console.log(code);
    return code;
}
// // -----------------------------Set ClipBoard Data--------------------------------------------
$(function() {
    var INDEX = 0; 
    $("#chat-submit").click(function(e) {
      e.preventDefault();
      var msg = $("#chat-input").val(); 
      if(msg.trim() == ''){
        return false;
      }
      generate_message(msg, 'self');
      var buttons = [
          {
            name: 'Existing User',
            value: 'existing'
          },
          {
            name: 'New User',
            value: 'new'
          }
        ];
      setTimeout(function() {      
        generate_message(msg, 'user');  
      }, 1000)
      
    })
    
    function generate_message(msg, type) {
      INDEX++;
      var str="";
      str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">";
      str += "          <span class=\"msg-avatar\">";
      str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
      str += "          <\/span>";
      str += "          <div class=\"cm-msg-text\">";
      str += msg;
      str += "          <\/div>";
      str += "        <\/div>";
      $(".chat-logs").append(str);
      $("#cm-msg-"+INDEX).hide().fadeIn(300);
      if(type == 'self'){
       $("#chat-input").val(''); 
      }    
      $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
    }  
    
    function generate_button_message(msg, buttons){    
      /* Buttons should be object array 
        [
          {
            name: 'Existing User',
            value: 'existing'
          },
          {
            name: 'New User',
            value: 'new'
          }
        ]
      */
      INDEX++;
      var btn_obj = buttons.map(function(button) {
         return  "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\""+button.value+"\">"+button.name+"<\/a><\/li>";
      }).join('');
      var str="";
      str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg user\">";
      str += "          <span class=\"msg-avatar\">";
      str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
      str += "          <\/span>";
      str += "          <div class=\"cm-msg-text\">";
      str += msg;
      str += "          <\/div>";
      str += "          <div class=\"cm-msg-button\">";
      str += "            <ul>";   
      str += btn_obj;
      str += "            <\/ul>";
      str += "          <\/div>";
      str += "        <\/div>";
      $(".chat-logs").append(str);
      $("#cm-msg-"+INDEX).hide().fadeIn(300);   
      $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
      $("#chat-input").attr("disabled", true);
    }
    
    $(document).delegate(".chat-btn", "click", function() {
      var value = $(this).attr("chat-value");
      var name = $(this).html();
      $("#chat-input").attr("disabled", false);
      generate_message(name, 'self');
    })
    
    $("#chat-circle").click(function() {    
      $("#chat-circle").toggle('scale');
      $(".chat-box").toggle('scale');
    })
    
    $(".chat-box-toggle").click(function() {
      $("#chat-circle").toggle('scale');
      $(".chat-box").toggle('scale');
    })
    
  })