
const chatForm  = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io();



//Get username and room

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });


socket.emit('joinRoom',{username,room});

socket.on('roomUsers',({room,users}) => {
  
    outputRoomName(room);
    outputUsers(users)
})


//Message from server
socket.on('message', message =>{
    console.log(message)
    outputMessage(message);

    //Scroll Bar
chatMessages.scrollTop = chatMessages.scrollHeight;

})

//Message submit 

chatForm.addEventListener('submit',e =>{
e.preventDefault();

//get meessage text
const msg = e.target.elements.msg.value;

//Emiting a message to the server
socket.emit('chatMessage',msg)

//clear input message
e.target.elements.msg.value = '';
e.target.elements.msg.focus();


})


// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span><span> ${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
  }

  //Add room name to DOM

  function outputRoomName(room){
    
    roomName.innerText = room

  }

  // Add users to dom

  function outputUsers(users){

    userList.innerHTML =`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}`;

  }