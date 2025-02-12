const socket = io("https://anonymous-chat-backend-jquo.onrender.com");

document.getElementById("startChat").addEventListener("click", function () {
    const username = document.getElementById("username").value.trim();
    if (username) {
        socket.emit("set_username", username);
        document.getElementById("usernameContainer").style.display = "none";
        document.getElementById("chatContainer").style.display = "block";
    }
});

socket.on("chat_start", (data) => {
    document.getElementById("chatBox").innerHTML = "<p>Connected to a partner!</p>";
});

socket.on("waiting", (message) => {
    document.getElementById("chatBox").innerHTML = `<p>${message}</p>`;
});

document.getElementById("sendMessage").addEventListener("click", function () {
    const message = document.getElementById("messageInput").value.trim();
    if (message) {
        socket.emit("send_message", message);
        document.getElementById("chatBox").innerHTML += `<p><b>You:</b> ${message}</p>`;
        document.getElementById("messageInput").value = "";
    }
});

socket.on("receive_message", (data) => {
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML += `<p><b>${data.sender}:</b> ${data.message}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
});

document.getElementById("newChat").addEventListener("click", function () {
    socket.emit("new_chat");
    document.getElementById("chatBox").innerHTML = "<p>Looking for a new partner...</p>";
});

socket.on("partner_disconnected", (message) => {
    document.getElementById("chatBox").innerHTML += `<p>${message}</p>`;
});

document.getElementById("darkModeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});
