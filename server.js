const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const {userJoin,getCurrentUser,getRoomusers,userLeave} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = "Admin"

// Run when client connects
io.on('connection', socket => {
 

  //Connect Room
 socket.on('joinRoom',({username,room})=>{

const user = userJoin(socket.id,username,room);

socket.join(user.room)

 //Welcome current user (single user chat)
 socket.emit('message',formatMessage(botName,'welcome to chat application'));


 //Broadcast when a user connects (group of user chat)
 socket.broadcast
 .to(user.room)
 .emit('message',formatMessage(botName,`${user.username} has joined the chat`));
 

 //send user room info

 io.to(user.room).emit('roomUsers',{

  room:user.room,
  users:getRoomusers(user.room)

 });
 });

  
   //Listen for the chatMessage

   socket.on('chatMessage',(msg)=>{

    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message',formatMessage(user.username,msg))

   })


   //Run when a client disconnect

   socket.on('disconnect',()=>{
     const user = userLeave(socket.id)

     if(user){
      io.to(user.room)
      .emit('message',formatMessage(botName,`${user.username} has left the chat`));
      
      //send user room info
      io.to(user.room).emit('roomUsers',{

      room:user.room,
      users:getRoomusers(user.room)

 });
     }
    
  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
