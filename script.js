document.addEventListener("DOMContentLoaded", () => {
    const socket = io("https://your-backend-url.onrender.com");
  
    let username = null;
  
    const usernameContainer = document.getElementById('usernameContainer');
    const chatContainer = document.getElementById('chatContainer');
    const startChatBtn = document.getElementById('startChat');
    const sendMessageBtn = document.getElementById('sendMessage');
    const newChatBtn = document.getElementById('newChat');
    const darkModeToggle = document.getElementById('toggleDarkMode');
    const messageInput = document.getElementById('messageInput');
    const chatBox = document.getElementById('chatBox');
  
    startChatBtn.addEventListener('click', () => {
      const input = document.getElementById('usernameInput').value.trim();
      if (input) {
        username = input;
        usernameContainer.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        socket.emit('join', username);
      } else {
        alert('Please enter a username');
      }
    });
  
    sendMessageBtn.addEventListener('click', () => {
      const message = messageInput.value.trim();
      if (message) {
        socket.emit('message', { username, message });
        messageInput.value = '';
      }
    });
  
    newChatBtn.addEventListener('click', () => {
      socket.emit('leave', username);
      socket.emit('join', username);
      chatBox.innerHTML = '';
    });
  
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  
    socket.on('message', (data) => {
      const messageItem = document.createElement('div');
      messageItem.textContent = `${data.username}: ${data.message}`;
      chatBox.appendChild(messageItem);
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  
    socket.on('user-joined', (user) => {
      const joinMsg = document.createElement('div');
      joinMsg.textContent = `${user} joined the chat`;
      joinMsg.style.fontStyle = 'italic';
      chatBox.appendChild(joinMsg);
    });
  
    socket.on('user-left', (user) => {
      const leaveMsg = document.createElement('div');
      leaveMsg.textContent = `${user} left the chat`;
      leaveMsg.style.fontStyle = 'italic';
      chatBox.appendChild(leaveMsg);
    });
  });
  