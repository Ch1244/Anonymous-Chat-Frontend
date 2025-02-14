document.addEventListener("DOMContentLoaded", () => {
  const socket = io("https://anonymous-chat-backend-jquo.onrender.com");
  const chatBox = document.getElementById("chatBox");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendMessage");
  const newChatButton = document.getElementById("newChat");
  const statusText = document.getElementById("status");

  let username = localStorage.getItem("username") || prompt("Enter your username:");
  if (username) {
    localStorage.setItem("username", username);
    socket.emit("joinChat", username);
    statusText.textContent = "Looking for a partner...";
  }

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

  socket.on("paired", (data) => {
    statusText.textContent = `Connected with ${data.partnerName}`;
    appendMessage("System", `Connected to ${data.partnerName}`);
  });

  socket.on("receiveMessage", (data) => {
    appendMessage(data.sender, data.message);
  });

  socket.on("partnerDisconnected", () => {
    statusText.textContent = "Your partner has left.";
    appendMessage("System", "Your partner has left.");
  });

  newChatButton.addEventListener("click", () => {
    socket.emit("leaveChat");
    chatBox.innerHTML = "";
    statusText.textContent = "Looking for a partner...";
    socket.emit("joinChat", username);
  });

  function appendMessage(sender, message) {
    const messageElement = document.createElement("p");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
