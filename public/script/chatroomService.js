const chatForm = document.getElementById('chat-input-content');
const chatMessages = document.querySelector('.chat-logs');
const submitbtn = document.getElementById('chat-submit');
// const roomName = document.getElementById('room-name');
// const userList = document.getElementById('users');

// Get username and room

const username = getUsername();
const room = document.location.pathname.split('/')[2];
// const color = localStorage.getItem('color')

const socket = io();

// Join chatroom (ok)

socket.emit('joinRoom', { username, room });

// Message from server
socket.on('message from bot', message => {
  console.log(message);
  outputMessage(message, 'system');

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message from server
socket.on('message from self', message => {
  console.log('My message', message);
  outputMessage(message, 'self');

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message from server
socket.on('message from others', message => {
  console.log('Others message', message);
  outputMessage(message, 'others');

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// // Message submit (OK)
submitbtn.addEventListener('click',sendMsg)

// let event=new Event('click')
chatForm.addEventListener('keyup',(e) => {
  if (e.code==='Enter'){
    submitbtn.dispatchEvent(new Event('click'));
  }
})
// // chatForm.addEventListener('submit', e => {
// submitbtn.addEventListener('click', e => {
//   // e.preventDefault();

//   // Get message text
//   // let msg = e.target.elements.msg.value;
//   let msg = document.getElementById('msg').value;
//   msg = msg.trim();

//   if (!msg) {
//     return false;
//   }

//   const color = localStorage.getItem('color');
//   // Emit message to server
//   socket.emit('chatMessage', { msg, color });

//   // Clear input
//   document.getElementById('msg').value = '';
//   document.getElementById('msg').focus();
// });


// Output message to DOM
function outputMessage(message, cssClassType) {
  // const msgcont=document.createElement('div');
  // msgcont.classList.add('message-cont');
  let color = localStorage.getItem('color')
  const msgdiv = document.createElement('div');
  msgdiv.classList.add('message');
  msgdiv.classList.add(cssClassType);
  const msgcontent = document.createElement('span');
  if (cssClassType != 'system') {
    msgcontent.setAttribute('style', `background-color:${message.color};opacity: .9;padding:2px;border-radius:5px`)
  }
  msgcontent.classList.add('text');
  msgcontent.innerHTML = `${message.text}<br>`;
  msgdiv.appendChild(msgcontent);

  if (cssClassType != 'system') {
    // msgdiv.setAttribute('style', `background-color:${message.color}`)
    const user = document.createElement('span');
    user.classList.add('user');
    user.innerText = message.username;
    msgdiv.appendChild(user);
  }

  // msgcont.appendChild(msgdiv);
  document.querySelector('.chat-logs').appendChild(msgdiv);
}


function getUsername() {
  let name = (Math.random().toString(36).substr(2, 7)).toString();
  let token=localStorage.getItem('access_token')
  let username = '';
  if (token) {
    username = localStorage.getItem('username');
  } else {
    username = name;
    localStorage.setItem('username',username);
  }
  console.log(username)
  return username;
};

function sendMsg(){
  let msg = document.getElementById('msg').value;
  msg = msg.trim();
  if (!msg) {return false;}

  const color = localStorage.getItem('color');
  // Emit message to server
  socket.emit('chatMessage', { msg, color });

  // Clear input
  document.getElementById('msg').value = '';
  document.getElementById('msg').focus();
}

