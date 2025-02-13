const socket = io("https://your-backend-url.onrender.com");

let username = "";
let connected = false;

document.getElementById('startChat').addEventListener('click', () => {
    username = document.getElementById('usernameInput').value.trim();
    if (username) {
        document.getElementById('welcomeScreen').classList.add('hidden');
        document.getElementById('chatScreen').classList.remove('hidden');
        socket.emit('join', username);
        connected = true;
    }
});

document.getElementById('sendMessage').addEventListener('click', () => {
    const message = document.getElementById('messageInput').value.trim();
    if (message) {
        socket.emit('message', { username, message });
        displayMessage(`You: ${message}`);
        document.getElementById('messageInput').value = '';
    }
});

document.getElementById('newChat').addEventListener('click', () => {
    if (connected) socket.emit('leave');
    document.getElementById('chatBox').innerHTML = '';
    document.getElementById('messageInput').value = '';
    socket.emit('join', username);
});

document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

socket.on('message', (data) => {
    displayMessage(`${data.username}: ${data.message}`);
});

socket.on('system', (message) => {
    displayMessage(`System: ${message}`);
});

function displayMessage(msg) {
    const messageBox = document.getElementById('chatBox');
    const messageItem = document.createElement('div');
    messageItem.textContent = msg;
    messageBox.appendChild(messageItem);
    messageBox.scrollTop = messageBox.scrollHeight;
}

// Rocket animation every 20 seconds
setInterval(() => {
    const rocket = document.createElement('div');
    rocket.classList.add('rocket');
    document.body.appendChild(rocket);
    setTimeout(() => rocket.remove(), 3000);
}, 20000);

// Asteroids animation every 30 seconds
setInterval(() => {
    const asteroid = document.createElement('div');
    asteroid.classList.add('asteroid');
    document.body.appendChild(asteroid);
    setTimeout(() => asteroid.remove(), 5000);
}, 30000);
