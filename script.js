document.addEventListener("DOMContentLoaded", () => {
    const socket = io("https://anonymous-chat-backend-jquo.onrender.com");
  
    let username;
  
    const welcomeScreen = document.getElementById('welcomeScreen');
    const continueBtn = document.getElementById('continueBtn');
    const usernameContainer = document.getElementById('usernameContainer');
    const chatContainer = document.getElementById('chatContainer');
    const chatBox = document.getElementById('chatBox');
    const messageInput = document.getElementById('messageInput');
  
    continueBtn.addEventListener('click', () => {
      welcomeScreen.classList.add('hidden');
      usernameContainer.classList.remove('hidden');
    });
  
    document.getElementById('startChat').addEventListener('click', () => {
      username = document.getElementById('usernameInput').value.trim();
      if (username) {
        usernameContainer.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        socket.emit('join', username);
      } else {
        alert('Please enter a username');
      }
    });
  
    document.getElementById('sendMessage').addEventListener('click', () => {
      const message = messageInput.value.trim();
      if (message) {
        socket.emit('sendMessage', { username, message });
        messageInput.value = '';
      }
    });
  
    document.getElementById('newChat').addEventListener('click', () => {
      socket.emit('leave');
      socket.emit('join', username);
      chatBox.innerHTML = '';
    });
  
    document.getElementById('darkModeToggle').addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  
    socket.on('message', (data) => {
      const messageItem = document.createElement('div');
      messageItem.textContent = `${data.username}: ${data.message}`;
      chatBox.appendChild(messageItem);
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  
    socket.on('user-left', () => {
      const messageItem = document.createElement('div');
      messageItem.textContent = "Your partner has left the chat.";
      chatBox.appendChild(messageItem);
    });
  });
  