const socket = io("https://anonymous-chat-backend-jquo.onrender.com");

const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', sendMessage);

function sendMessage() {
  const message = document.getElementById('messageInput').value;
  if (message.trim()) {
    socket.emit('message', message);
    document.getElementById('messageInput').value = '';
  }
}

socket.on('message', (msg) => {
  const chatBox = document.getElementById('chatBox');
  const messageElement = document.createElement('div');
  messageElement.textContent = msg;
  chatBox.appendChild(messageElement);
});
