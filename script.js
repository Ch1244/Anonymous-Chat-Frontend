const socket = io("https://anonymous-chat-backend-jquo.onrender.com"); // Use your backend URL

const usernameInput = document.getElementById("usernameInput");
const startChatBtn = document.getElementById("startChat");
const chatContainer = document.getElementById("chatContainer");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessage");
const newChatBtn = document.getElementById("newChat");
const typingIndicator = document.getElementById("typingIndicator");

let username = "";
let partnerName = "";

startChatBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (username) {
    socket.emit("setUsername", username);
    document.getElementById("usernameContainer").style.display = "none"; // Hide username input
    chatContainer.style.display = "block"; // Show chat UI
  }
});

socket.on("waiting", () => {
  chatBox.innerHTML = "<p>Looking for a partner...</p>";
});

socket.on("paired", (data) => {
  partnerName = data.partnerName;
  chatBox.innerHTML = `<p>Connected with <strong>${partnerName}</strong></p>`;
});

sendMessageBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", () => {
  socket.emit("typing");
});

messageInput.addEventListener("keyup", () => {
  setTimeout(() => socket.emit("stopTyping"), 2000);
});

socket.on("typing", (name) => {
  typingIndicator.innerText = `${name} is typing...`;
});

socket.on("stopTyping", () => {
  typingIndicator.innerText = "";
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    chatBox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    socket.emit("sendMessage", message);
    messageInput.value = "";
  }
}

socket.on("receiveMessage", (data) => {
  chatBox.innerHTML += `<p><strong>${data.sender}:</strong> ${data.message}</p>`;
});

socket.on("partnerDisconnected", () => {
  chatBox.innerHTML += `<p><strong>${partnerName} has left the chat.</strong></p>`;
});

newChatBtn.addEventListener("click", () => {
  chatBox.innerHTML = "<p>Looking for a partner...</p>";
  socket.emit("newChat");
});
