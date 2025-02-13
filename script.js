document.addEventListener("DOMContentLoaded", () => {
    const socket = io("https://anonymous-chat-backend-jquo.onrender.com");
  
    let username;
    const statusText = document.getElementById('statusText');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
  
    // Start Chat Button
    document.getElementById('startChat').addEventListener('click', () => {
      username = document.getElementById('usernameInput').value.trim();
      if (username) {
        document.getElementById('usernameContainer').classList.add('hidden');
        document.getElementById('chatContainer').classList.remove('hidden');
        statusText.textContent = "Looking for a partner..."; // Show while pairing
        socket.emit('join', username);
      } else {
        alert('Please enter a username');
      }
    });
  
    // Send Message Button
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
  
    // New Chat Button
    document.getElementById('newChat').addEventListener('click', () => {
      socket.emit('leave');
      socket.emit('join', username);
      document.getElementById('chatBox').innerHTML = '';
      statusText.textContent = "Looking for a partner..."; // Show again when searching
    });
  
    // Dark Mode / Light Mode Toggle
    darkModeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      if (body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = "☀️ Light Mode";
      } else {
        darkModeToggle.textContent = "🌙 Dark Mode";
      }
    });
  
    // Receiving Messages
    socket.on('message', (data) => {
      if (data.username === "System" && data.message.includes("Connected")) {
        statusText.textContent = ""; // Hide "Looking for a partner..." after pairing
      }
      const chatBox = document.getElementById('chatBox');
      const messageItem = document.createElement('div');
      messageItem.classList.add('chat-message');
      messageItem.textContent = `${data.username}: ${data.message}`;
      chatBox.appendChild(messageItem);
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  
    // Partner Disconnected
    socket.on('user-left', () => {
      statusText.textContent = "Looking for a partner...";
      const messageItem = document.createElement('div');
      messageItem.textContent = "Your partner has left the chat.";
      messageItem.style.fontStyle = 'italic';
      document.getElementById('chatBox').appendChild(messageItem);
    });
  
    // 🚀 Rocket Animation (Now every 30 seconds)
    function launchRocket() {
      const rocket = document.createElement('img');
      rocket.src = "https://cdn-icons-png.flaticon.com/512/3213/3213924.png"; // Rocket image
      rocket.classList.add('rocket');
  
      document.body.appendChild(rocket);
  
      setTimeout(() => {
        rocket.classList.add('rocket-fly');
      }, 100);
  
      setTimeout(() => {
        rocket.remove();
      }, 4000);
    }
  
    // Launch rocket every 30 seconds
    setInterval(launchRocket, 30000);
  });
  