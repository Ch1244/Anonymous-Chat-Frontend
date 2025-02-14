const socket = io("https://anonymous-chat-backend-jquo.onrender.com");

let username = localStorage.getItem('username') || prompt("Enter your username:");
localStorage.setItem('username', username);

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const statusText = document.getElementById("statusText");

// When connected, remove "Looking for a partner..." and show connected partner
socket.on("connect", () => {
    statusText.textContent = "Looking for a partner...";
    socket.emit("join", username);
});

socket.on("partnerConnected", (partnerName) => {
    statusText.textContent = `Connected with ${partnerName}`;
    chatBox.innerHTML = `<p class="system">Connected to ${partnerName}</p>`;
});

socket.on("message", (data) => {
    chatBox.innerHTML += `<p><strong>${data.sender}:</strong> ${data.message}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
});

sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("message", { sender: username, message: message });
        chatBox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
        messageInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

socket.on("partnerDisconnected", () => {
    statusText.textContent = "Your partner has left.";
    chatBox.innerHTML += `<p class="system">Your partner has left.</p>`;
});
