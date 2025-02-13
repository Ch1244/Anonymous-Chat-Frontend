document.addEventListener("DOMContentLoaded", () => {
    const socket = io("https://anonymous-chat-backend-jquo.onrender.com");
  
    let username;
    const statusText = document.getElementById('statusText');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
  
    document.getElementById('startChat').addEventListener('click', () => {
      username = document.getElementById('usernameInput').value.trim();
      if (username) {
        document.getElementById('usernameContainer').classList.add('hidden');
        document.getElementById('chatContainer').classList.remove('hidden');
        statusText.textContent = "Looking for a partner...";
        socket.emit('join', username);
      } else {
        alert('Please enter a username');
      }
    });
  
    document.getElementById('sendMessage').addEventListener('click', () => {
      const message = document.getElementById('messageInput').value.trim();
      if (message) {
        const chatBox = document.getElementById('chatBox');
        const messageItem = document.createElement('div');
        messageItem.classList.add('chat-message', 'you');
        messageItem.textContent = `You: ${message}`;
        chatBox.appendChild(messageItem);
        chatBox.scrollTop = chatBox.scrollHeight;
  
        socket.emit('sendMessage', { username, message });
        document.getElementById('messageInput').value = '';
      }
    });
  
    document.getElementById('newChat').addEventListener('click', () => {
      socket.emit('leave');
      socket.emit('join', username);
      document.getElementById('chatBox').innerHTML = '';
      statusText.textContent = "Looking for a partner...";
    });
  
    darkModeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      if (body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = "☀️ Light Mode";
      } else {
        darkModeToggle.textContent = "🌙 Dark Mode";
      }
    });
  
    socket.on('message', (data) => {
      if (data.username === "System" && data.message.includes("Connected")) {
        statusText.textContent = "";
      }
      const chatBox = document.getElementById('chatBox');
      const messageItem = document.createElement('div');
      messageItem.classList.add('chat-message');
      messageItem.textContent = `${data.username}: ${data.message}`;
      chatBox.appendChild(messageItem);
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  
    socket.on('user-left', () => {
      statusText.textContent = "Looking for a partner...";
      const messageItem = document.createElement('div');
      messageItem.textContent = "Your partner has left the chat.";
      messageItem.style.fontStyle = 'italic';
      document.getElementById('chatBox').appendChild(messageItem);
    });
  
    // 🚀 Rocket Animation every 20s
    function launchRocket() {
      const rocket = document.createElement('img');
      rocket.src = "https://cdn-icons-png.flaticon.com/512/3213/3213924.png";
      rocket.classList.add('rocket');
      document.body.appendChild(rocket);
      setTimeout(() => rocket.classList.add('rocket-fly'), 100);
      setTimeout(() => rocket.remove(), 4000);
    }
  
    setInterval(launchRocket, 20000);
  
    // 🪨 Asteroids Animation
    function launchAsteroid() {
      const asteroid = document.createElement('div');
      asteroid.classList.add('asteroid');
      asteroid.style.top = `${Math.random() * 100}vh`;
      asteroid.style.left = `${Math.random() * 100}vw`;
      document.body.appendChild(asteroid);
      setTimeout(() => asteroid.remove(), 6000);
    }
  
    setInterval(launchAsteroid, 5000);
  });
  