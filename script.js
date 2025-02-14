const socket = io("https://your-backend-url.onrender.com");

const toggleButton = document.getElementById('toggleMode');
const status = document.getElementById('status');
const usernameInput = document.getElementById('username');
const startChatButton = document.getElementById('startChat');
const chatBox = document.getElementById('chatBox');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

let username = '';

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
});

startChatButton.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    socket.emit('join', username);
    status.textContent = 'Looking for a partner...';
    chatBox.style.display = 'block';
    usernameInput.style.display = 'none';
    startChatButton.style.display = 'none';
  }
});

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
    displayMessage(`You: ${message}`, 'right');
    messageInput.value = '';
    messageInput.style.height = '40px';
  }
}

socket.on('message', (data) => {
  displayMessage(`${data.username}: ${data.message}`, 'left');
});

socket.on('partnerLeft', () => {
  displayMessage('Partner has left the chat.', 'center');
});

function displayMessage(text, side) {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.classList.add('message', side);
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

messageInput.addEventListener('input', () => {
  messageInput.style.height = '40px';
  messageInput.style.height = messageInput.scrollHeight + 'px';
});
