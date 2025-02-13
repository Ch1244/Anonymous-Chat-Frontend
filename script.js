document.addEventListener("DOMContentLoaded", () => {
    const socket = io("https://anonymous-chat-backend-jquo.onrender.com");
  
    let username;
  
    document.getElementById('startChat').addEventListener('click', () => {
      username = document.getElementById('usernameInput').value.trim();
      if (username) {
        document.getElementById('usernameContainer').classList.add('hidden');
        document.getElementById('chatContainer').classList.remove('hidden');
        document.querySelector('h1').textContent = "Looking for a partner...";
        socket.emit('join', username);
      } else {
        alert('Please enter a username');
      }
    });
  
    document.getElementById('sendMessage').addEventListener('click', () => {
      const message = document.getElementById('messageInput').value.trim();
      if (message) {
        socket.emit('sendMessage', { username, message });
        document.getElementById('messageInput').value = '';
      }
    });
  
    document.getElementById('newChat').addEventListener('click', () => {
      socket.emit('leave');
      socket.emit('join', username);
      document.getElementById('chatBox').innerHTML = '';
      document.querySelector('h1').textContent = "Looking for a partner...";
    });
  
    document.getElementById('darkModeToggle').addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  
    socket.on('message', (data) => {
      if (data.username === "System" && data.message.includes("Connected")) {
        document.querySelector('h1').textContent = "";  // Remove "Looking for a partner..."
      }
      const chatBox = document.getElementById('chatBox');
      const messageItem = document.createElement('div');
      messageItem.textContent = `${data.username}: ${data.message}`;
      chatBox.appendChild(messageItem);
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  
    socket.on('user-left', () => {
      const messageItem = document.createElement('div');
      messageItem.textContent = "Your partner has left the chat.";
      document.getElementById('chatBox').appendChild(messageItem);
    });
  });
  