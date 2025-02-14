const socket = io("https://anonymous-chat-backend-jquo.onrender.com");
const username = localStorage.getItem('username') || `User${Math.floor(Math.random() * 1000)}`;

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const message = document.getElementById('message-input').value;
  if (message.trim()) {
    socket.emit('chatMessage', { username, message });
    document.getElementById('message-input').value = '';
  }
}

socket.on('chatMessage', (data) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${data.username}: ${data.message}`;
  document.getElementById('messages').appendChild(messageElement);
});
