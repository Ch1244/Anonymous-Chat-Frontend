const socket = io("https://anonymous-chat-backend-jquo.onrender.com");

let username = localStorage.getItem('username') || null;

if (!username) {
  username = prompt("Enter your username:");
  localStorage.setItem('username', username);
}

socket.emit('join', username);

socket.on('message', data => {
  const messageContainer = document.getElementById('messageContainer');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(data.sender === username ? 'myMessage' : 'otherMessage');
  messageDiv.textContent = `${data.sender}: ${data.message}`;
  messageContainer.appendChild(messageDiv);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

document.getElementById('sendButton').addEventListener('click', sendMessage);

function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (message) {
    socket.emit('message', { sender: username, message });
    input.value = '';
    input.style.height = 'auto';
  }
}

document.getElementById('messageInput').addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});
