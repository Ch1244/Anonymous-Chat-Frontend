document.addEventListener("DOMContentLoaded", () => {
  const socket = io("https://anonymous-chat-backend-jquo.onrender.com");

  const chatBox = document.getElementById("chatBox");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendMessage");
  const statusText = document.getElementById("status");

  let username = localStorage.getItem("username") || prompt("Enter your username:");
  if (username) {
    localStorage.setItem("username", username);
    socket.emit("joinChat", username);
    statusText.textContent = "Looking for a partner...";
  }

  sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
      socket.emit("sendMessage", { message, username });
      appendMessage("You", message);
      messageInput.value = "";
    }
  });

  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendButton.click();
  });

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

  function appendMessage(sender, message) {
    const messageElement = document.createElement("p");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
