const socket = io("https://anonymous-chat-backend-jquo.onrender.com");

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendMessage");
const statusText = document.getElementById("status");

let username = null;

window.addEventListener("load", () => {
  username = localStorage.getItem("username") || prompt("Enter your username:");
  if (username) {
    localStorage.setItem("username", username);
    socket.emit("joinChat", username);
    statusText.textContent = "Looking for a partner...";
  }
});

socket.on("paired", (data) => {
  statusText.textContent = `Connected with ${data.partnerName}`;
  chatBox.innerHTML += `<p class="system">System: Connected to ${data.partnerName}</p>`;
});

socket.on("waiting", () => {
  statusText.textContent = "Looking for a partner...";
});

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("sendMessage", { message, username });
    appendMessage("You", message);
    messageInput.value = "";
  }
}

socket.on("receiveMessage", (data) => {
  appendMessage(data.sender, data.message);
});

function appendMessage(sender, message) {
  const messageElement = document.createElement("p");
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  messageElement.classList.add(sender === "You" ? "you" : "partner");
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

socket.on("partnerDisconnected", () => {
  statusText.textContent = "Your partner has left.";
  appendMessage("System", "Your partner has left.");
});
