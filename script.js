const socket = io("https://anonymous-chat-backend-jquo.onrender.com");
const usernameInput = document.getElementById("username");
const startButton = document.getElementById("startChat");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

let partnerId = null;

startButton.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (username) {
        socket.emit("join", username);
        usernameInput.disabled = true;
        startButton.disabled = true;
    }
});

socket.on("partner", (partner) => {
    partnerId = partner.id;
    chatBox.innerHTML += `<p>System: Connected to ${partner.name}</p>`;
});

sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message && partnerId) {
        socket.emit("message", { to: partnerId, text: message });
        chatBox.innerHTML += `<p>You: ${message}</p>`;
        messageInput.value = "";
    }
});

socket.on("message", (data) => {
    chatBox.innerHTML += `<p>${data.from}: ${data.text}</p>`;
});
