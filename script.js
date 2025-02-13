const socket = io("https://your-backend-url.onrender.com");

let username;

document.getElementById('startChat').addEventListener('click', () => {
  username = document.getElementById('usernameInput').value.trim();
  if (username) {
    document.getElementById('usernameContainer').classList.add('hidden');
    document.getElementById('chatContainer').classList.remove('hidden');
    socket.emit('join', username);
  } else {
    alert('Please enter a username');
  }
});

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
    socket.emit('message', { username, message });
    displayMessage(`You: ${message}`);
    messageInput.value = '';
    messageInput.style.height = '40px';
  }
}

socket.on('message', (data) => {
  displayMessage(`${data.username}: ${data.message}`);
});

socket.on('system', (msg) => {
  displayMessage(`System: ${msg}`);
  if (msg.includes("Connected")) {
    document.getElementById('statusText').textContent = ""; // Hide after pairing
  }
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
