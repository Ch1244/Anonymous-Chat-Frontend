const socket = io('https://anonymous-chat-backend-jquo.onrender.com');

document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = 'username.html';
    return;
  }

  const status = document.getElementById('status');
  const messageContainer = document.getElementById('messageContainer');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');

  sendButton.addEventListener('click', sendMessage);

  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      socket.emit('message', { username, message });
      appendMessage('You', message, 'right');
      messageInput.value = '';
      messageInput.style.height = 'auto';
    }
  }

  function appendMessage(sender, message, side) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', side);
    messageElement.textContent = `${sender}: ${message}`;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  socket.on('connect', () => {
    socket.emit('join', username);
    status.textContent = 'Connected to a partner';
  });

  socket.on('message', (data) => {
    appendMessage(data.username, data.message, 'left');
  });

  socket.on('disconnect', () => {
    status.textContent = 'Your partner has left.';
  });

  function autoExpand(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
});
