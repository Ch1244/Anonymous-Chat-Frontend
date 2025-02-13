const socket = io("https://your-backend-url.onrender.com");

const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.getElementById('messageContainer');

// Send message
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', message);
    displayMessage(`You: ${message}`);
    messageInput.value = '';
    messageInput.style.height = '40px';
  }
}

socket.on('message', (data) => {
  displayMessage(`${data.username}: ${data.message}`);
});

function displayMessage(message) {
  const msg = document.createElement('div');
  msg.textContent = message;
  messageContainer.appendChild(msg);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Auto-expand input
messageInput.addEventListener('input', () => {
  messageInput.style.height = 'auto';
  messageInput.style.height = `${messageInput.scrollHeight}px`;
});
