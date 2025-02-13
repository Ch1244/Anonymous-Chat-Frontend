const socket = io("https://your-backend-url.onrender.com");

let username = null;

document.getElementById("startChat").addEventListener("click", () => {
  username = document.getElementById("usernameInput").value.trim();
  if (username) {
    document.getElementById("usernameInputContainer").classList.add("hidden");
    document.getElementById("chatBox").classList.remove("hidden");
    document.getElementById("messageInputContainer").classList.remove("hidden");
    document.getElementById("statusText").textContent = "Looking for a partner...";
    socket.emit("join", username);
  } else {
    alert("Please enter a username.");
  }
});

document.getElementById("sendMessage").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value.trim();
  if (message) {
    socket.emit("sendMessage", message);
    document.getElementById("messageInput").value = "";
  }
});

document.getElementById("newChat").addEventListener("click", () => {
  document.getElementById("chatBox").innerHTML = "";
  document.getElementById("statusText").textContent = "Looking for a partner...";
  socket.emit("newChat", username); // Reuse the same username
});

document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

socket.on("message", (data) => {
  const messageItem = document.createElement("div");
  messageItem.textContent = `${data.username}: ${data.message}`;
  document.getElementById("chatBox").appendChild(messageItem);
});

socket.on("partnerDisconnected", () => {
  const messageItem = document.createElement("div");
  messageItem.textContent = "Your partner has left.";
  document.getElementById("chatBox").appendChild(messageItem);
});
