const chatForm = document.getElementById('chat-input-content');
const chatMessages = document.querySelector('.chat-logs');
const submitbtn = document.getElementById('chat-submit');

// Get username and room
const username = getUsername();
const room = document.location.pathname.split('/')[2];


const socket = io();

// Join chatroom 
socket.emit('joinRoom', { username, room });

// Message from server
socket.on('message from bot', message => {
  outputMessage(message, 'system');
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message from server
socket.on('message from self', message => {
  console.log('My message', message);
  outputMessage(message, 'self');
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message from server
socket.on('message from others', message => {
  outputMessage(message, 'others');
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

// Output message to DOM
function outputMessage(message, cssClassType) {
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
    const user = document.createElement('span');
    user.classList.add('user');
    user.innerText = message.username;
    msgdiv.appendChild(user);
  }
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

