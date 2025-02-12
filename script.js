const socket = io("https://anonymous-chat-backend-jquo.onrender.com");

let username = "";
let partner = null;

document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const startChatBtn = document.getElementById("startChat");
    const sendMessageBtn = document.getElementById("sendMessage");
    const newChatBtn = document.getElementById("newChat");
    const messageInput = document.getElementById("messageInput");
    const chatBox = document.getElementById("chatBox");
    const statusText = document.getElementById("status");
    const typingIndicator = document.getElementById("typingIndicator");
    const loginContainer = document.getElementById("loginContainer");
    const chatContainer = document.getElementById("chatContainer");

    if (!darkModeToggle || !startChatBtn || !sendMessageBtn || !newChatBtn || !messageInput || !chatBox) {
        console.error("Some elements are missing! Check your HTML.");
        return;
    }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    startChatBtn.addEventListener("click", () => {
        username = document.getElementById("usernameInput").value.trim();
        if (username) {
            loginContainer.classList.add("hidden");
            chatContainer.classList.remove("hidden");
            socket.emit("join", username);
        }
    });

    sendMessageBtn.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message && partner) {
            socket.emit("sendMessage", { to: partner, message });
            appendMessage(`You: ${message}`);
            messageInput.value = "";
        }
    });

    newChatBtn.addEventListener("click", () => {
        socket.emit("leave");
        location.reload();
    });

    messageInput.addEventListener("input", () => {
        if (partner) socket.emit("typing", { to: partner });
    });

    socket.on("paired", (data) => {
        partner = data.partner;
        statusText.innerText = `Connected with ${data.partnerName}`;
    });

    socket.on("receiveMessage", (data) => {
        appendMessage(`${data.fromName}: ${data.message}`);
    });

    socket.on("typing", () => {
        typingIndicator.classList.remove("hidden");
        setTimeout(() => {
            typingIndicator.classList.add("hidden");
        }, 1000);
    });

    socket.on("partnerLeft", () => {
        appendMessage("Partner has disconnected.");
        partner = null;
    });

    function appendMessage(msg) {
        const msgDiv = document.createElement("div");
        msgDiv.textContent = msg;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
