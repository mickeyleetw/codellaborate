const botName = 'chatbot';
// const usertable={};

const socketListener = io => {
  io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      const user = userJoin(socket.id, username, room);

      socket.join(user.room);

      // Welcome current user
      socket.emit('message from bot', formatMessage(botName, 'Welcome!'));

      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          'message from bot',
          formatMessage(botName, `${user.username} has joined the chat`)
        );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });

    // Listen for chatMessage
    socket.on('chatMessage', ({ msg, color }) => {
      const user = getCurrentUser(socket.id);

      // io.to(user.room).emit('message', formatMessage(user.username, msg));

      socket.emit('message from self', formatMessage(user.username, msg, color));

      socket.broadcast
        .to(user.room).emit('message from others', formatMessage(user.username, msg, color));

    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          'message from bot',
          formatMessage(botName, `${user.username} has left the chat`)
        );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });
}
//-----------------------------------------------------------------------------
const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}



//-----------------------------------------------------------------------------
const moment = require('moment');

function formatMessage(username, text, color) {
  return {
    username,
    text,
    color
  };
}


module.exports = {
  socketListener,
  users,
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  formatMessage
};