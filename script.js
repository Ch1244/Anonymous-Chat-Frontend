const socket = io("https://your-backend-url.onrender.com");

let username = null;

document.getElementById('startChat').addEventListener('click', () => {
  if (!username) {
    username = document.getElementById('usernameInput').value.trim();
  }
  if (username) {
    document.getElementById('usernameContainer').classList.add('hidden');
    document.getElementById('chatContainer').classList.remove('hidden');
    socket.emit('join', username);
  }
});

document.getElementById('sendMessage').addEventListener('click', () => {
  const message = document.getElementById('messageInput').value;
  if (message.trim()) {
    socket.emit('message', message);
    document.getElementById('messageInput').value = '';
  }
});

document.getElementById('newChat').addEventListener('click', () => {
  socket.emit('leave');
  document.getElementById('chatBox').innerHTML = '';
  socket.emit('join', username);
});

socket.on('message', (data) => {
  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML += `<p><strong>${data.user}:</strong> ${data.message}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
});

document.getElementById('darkModeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
