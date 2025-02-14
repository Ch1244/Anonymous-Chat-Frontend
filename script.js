const socket = io("https://anonymous-chat-backend-jquo.onrender.com");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendMessage = document.getElementById("sendMessage");
const status = document.getElementById("status");

const username = localStorage.getItem("chatUsername");
socket.emit("join", username);

socket.on("message", (data) => {
  const msg = document.createElement("div");
  msg.textContent = `${data.from}: ${data.message}`;
  msg.classList.add(data.from === username ? "my-message" : "partner-message");
  chatBox.appendChild(msg);
});

sendMessage.addEventListener("click", sendChat);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendChat();
});

function sendChat() {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("message", message);
    messageInput.value = "";
  }
}

socket.on("partner", (partnerId) => {
  if (partnerId) {
    status.textContent = `Connected with ${partnerId}`;
  } else {
    status.textContent = "Looking for a partner...";
  }
});
