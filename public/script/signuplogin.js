document.getElementById('login').addEventListener('click', signin);
document.getElementById("signup").addEventListener('click', signup);
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
// -------------------------------------------------------------------------
function signup() {
  const userData = {
      "name": document.getElementById('exampleInputName2').value,
      "email": document.getElementById('exampleInputEmail2').value,
      "password": document.getElementById('exampleInputPassword2').value,
  }
  fetch('/user/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
  })
  .then(checkStatus)
  .then(json => {
      console.log("FINISH parse RESPONSE");
      const token = json.data.access_token;
      const name=json.data.user.name;
      localStorage.setItem('access_token', token);
      localStorage.setItem('username', name);
      window.location.href = "/index.html";
  }).catch(error => {
      console.log('Fetch Error???: ', error);
  })
}
// -------------------------------------------------------------------------
let $loginMsg = $('.loginMsg'),
  $login = $('.login'),
  $signupMsg = $('.signupMsg'),
  $signup = $('.signup'),
  $frontbox = $('.frontbox');

$('#switch1').on('click', function() {
  $loginMsg.toggleClass("visibility");
  $frontbox.addClass("moving");
  $signupMsg.toggleClass("visibility");

  $signup.toggleClass('hide');
  $login.toggleClass('hide');
})

$('#switch2').on('click', function() {
  $loginMsg.toggleClass("visibility");
  $frontbox.removeClass("moving");
  $signupMsg.toggleClass("visibility");

  $signup.toggleClass('hide');
  $login.toggleClass('hide');
})
