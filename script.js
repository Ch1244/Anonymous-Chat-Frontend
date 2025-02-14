const socket = io("https://anonymous-chat-backend-jquo.onrender.com");
const username = localStorage.getItem('username') || `User${Math.floor(Math.random() * 1000)}`;
let paired = false;

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const message = document.getElementById('message-input').value;
  if (message.trim() && paired) {
    socket.emit('chatMessage', { username, message });
    document.getElementById('message-input').value = '';
  }
}

socket.on('pairing', () => {
  document.getElementById('status').textContent = 'Looking for a partner...';
});

socket.on('paired', () => {
  paired = true;
  document.getElementById('status').textContent = 'Connected!';
});

socket.on('chatMessage', (data) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${data.username}: ${data.message}`;
  document.getElementById('messages').appendChild(messageElement);
});
