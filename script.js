const socket = io("https://anonymous-chat-backend-jquo.onrender.com");

document.getElementById("startChat").addEventListener("click", () => {
    const username = document.getElementById("usernameInput").value;
    if (username.trim() === "") return;

    document.querySelector("h1").style.display = "none";
    document.getElementById("usernameInput").style.display = "none";
    document.getElementById("startChat").style.display = "none";
    document.getElementById("chatContainer").style.display = "block";

    socket.emit("joinChat", username);
});

socket.on("paired", (partner) => {
    document.getElementById("chatBox").innerHTML = `<p>Connected with ${partner}</p>`;
});

document.getElementById("sendMessage").addEventListener("click", () => {
    const message = document.getElementById("messageInput").value;
    if (message.trim() === "") return;

    socket.emit("sendMessage", message);
    document.getElementById("chatBox").innerHTML += `<p><b>You:</b> ${message}</p>`;
    document.getElementById("messageInput").value = "";
});

socket.on("receiveMessage", (msg) => {
    document.getElementById("chatBox").innerHTML += `<p><b>Partner:</b> ${msg}</p>`;
});

document.getElementById("newChat").addEventListener("click", () => {
    socket.emit("leaveChat");
    document.getElementById("chatBox").innerHTML = `<p>Looking for a partner...</p>`;
});

document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
