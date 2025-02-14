const socket = io("https://anonymous-chat-backend-jquo.onrender.com");

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendMessage");
const statusText = document.getElementById("status");

let username = null;

window.onload = () => {
  username = localStorage.getItem("username") || prompt("Enter your username:");
  if (username) {
    localStorage.setItem("username", username);
    socket.emit("joinChat", username);
    statusText.textContent = `Looking for a partner...`;
  }
};

socket.on("paired", (data) => {
  statusText.textContent = `Connected with ${data.partnerName}`;
  chatBox.innerHTML += `<p class="system">System: Connected to ${data.partnerName}</p>`;
});

socket.on("waiting", () => {
  statusText.textContent = "Looking for a partner...";
});

sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("sendMessage", message);
    messageInput.value = "";
  }
});

socket.on("receiveMessage", (data) => {
  chatBox.innerHTML += `<p><strong>${data.sender}:</strong> ${data.message}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("partnerDisconnected", () => {
  statusText.textContent = "Your partner has left.";
  chatBox.innerHTML += `<p class="system">Your partner has left.</p>`;
});
