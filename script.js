const socket = io("https://anonymous-chat-backend-jquo.onrender.com");

const messageInput = document.getElementById("messageInput");
const messageList = document.getElementById("chatBox");
const sendButton = document.getElementById("sendMessage");

socket.on("partnerConnected", () => {
  appendMessage("System: Connected to partner");
});

socket.on("message", (data) => {
  appendMessage(`Partner: ${data}`);
});

socket.on("partnerDisconnected", () => {
  appendMessage("System: Your partner has left.");
});

sendButton.addEventListener("click", () => {
  const msg = messageInput.value;
  appendMessage(`You: ${msg}`);
  socket.emit("message", msg);
  messageInput.value = "";
});

function appendMessage(msg) {
  const messageItem = document.createElement("div");
  messageItem.textContent = msg;
  messageList.appendChild(messageItem);
  messageList.scrollTop = messageList.scrollHeight;
}
