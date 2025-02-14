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
    if (statusText) statusText.textContent = "Looking for a partner...";
  }
});

socket.on("paired", (data) => {
  if (statusText) statusText.textContent = `Connected with ${data.partnerName}`;
  if (chatBox) chatBox.innerHTML += `<p class="system">System: Connected to ${data.partnerName}</p>`;
});

socket.on("waiting", () => {
  if (statusText) statusText.textContent = "Looking for a partner...";
});

if (sendButton) sendButton.addEventListener("click", sendMessage);
if (messageInput) messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = messageInput?.value.trim();
  if (message) {
    socket.emit("sendMessage", { message, username });
    appendMessage("You", message);
    if (messageInput) messageInput.value = "";
  }
}

socket.on("receiveMessage", (data) => {
  appendMessage(data.sender, data.message);
});

function appendMessage(sender, message) {
  if (chatBox) {
    const messageElement = document.createElement("p");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    messageElement.classList.add(sender === "You" ? "you" : "partner");
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

socket.on("partnerDisconnected", () => {
  if (statusText) statusText.textContent = "Your partner has left.";
  appendMessage("System", "Your partner has left.");
});
