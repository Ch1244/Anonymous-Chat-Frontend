const socket = io("https://anonymous-chat-backend-jquo.onrender.com");

let username = null;

document.getElementById("startChat").addEventListener("click", () => {
  const input = document.getElementById("usernameInput").value.trim();
  if (input) {
    username = input;
    document.getElementById("usernameContainer").classList.add("hidden");
    document.getElementById("chatContainer").classList.remove("hidden");
    socket.emit("join", username);
  }
});

document.getElementById("sendMessage").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value.trim();
  if (message) {
    socket.emit("chatMessage", message);
    document.getElementById("messageInput").value = "";
  }
});

document.getElementById("newChat").addEventListener("click", () => {
  socket.emit("leaveChat");
  socket.emit("join", username); // Rejoin with the same username
  document.getElementById("chatBox").innerHTML = "";
});

socket.on("message", (msg) => {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML += `<p>${msg}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
});
