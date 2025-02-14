window.onload = function() {
  const socket = io("https://anonymous-chat-backend-jquo.onrender.com");
  const statusText = document.getElementById("status");
  const chatBox = document.getElementById("chatBox");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");

  sendButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  socket.on("connect", () => {
    statusText.textContent = "Looking for a partner...";
    socket.emit("findPartner");
  });

  socket.on("partnerFound", (partnerId) => {
    statusText.textContent = `Connected to ${partnerId}`;
    chatBox.innerHTML += `<p class="system">System: Connected to ${partnerId}</p>`;
  });

  socket.on("receiveMessage", (data) => {
    chatBox.innerHTML += `<p><strong>${data.sender}:</strong> ${data.message}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  socket.on("partnerDisconnected", () => {
    statusText.textContent = "Your partner has left.";
    chatBox.innerHTML += `<p class="system">Your partner has left.</p>`;
  });

  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      socket.emit("sendMessage", message);
      chatBox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
      messageInput.value = "";
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }
};
