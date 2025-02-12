const socket = io("https://anonymous-chat-backend-jquo.onrender.com");
let username = "";
let partner = null;

// Ensure elements exist before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const startChatBtn = document.getElementById("startChat");
    const sendMessageBtn = document.getElementById("sendMessage");
    const newChatBtn = document.getElementById("newChat");
    const messageInput = document.getElementById("messageInput");

    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
        });
    }

    if (startChatBtn) {
        startChatBtn.addEventListener("click", () => {
            username = document.getElementById("usernameInput").value.trim();
            if (username) {
                document.getElementById("loginContainer").classList.add("hidden");
                document.getElementById("chatContainer").classList.remove("hidden");
                socket.emit("join", username);
            }
        });
    }

    if (sendMessageBtn) {
        sendMessageBtn.addEventListener("click", () => {
            const message = messageInput.value;
            if (message && partner) {
                socket.emit("sendMessage", { to: partner, message });
                appendMessage(`You: ${message}`);
                messageInput.value = "";
            }
        });
    }

    if (newChatBtn) {
        newChatBtn.addEventListener("click", () => {
            socket.emit("leave");
            location.reload();
        });
    }

    if (messageInput) {
        messageInput.addEventListener("input", () => {
            if (partner) socket.emit("typing", { to: partner });
        });
    }

    socket.on("paired", (data) => {
        partner = data.partner;
        document.getElementById("status").innerText = `Connected with ${data.partnerName}`;
    });

    socket.on("receiveMessage", (data) => {
        appendMessage(`${data.fromName}: ${data.message}`);
    });

    socket.on("typing", () => {
        const typingIndicator = document.getElementById("typingIndicator");
        if (typingIndicator) {
            typingIndicator.classList.remove("hidden");
            setTimeout(() => {
                typingIndicator.classList.add("hidden");
            }, 1000);
        }
    });

    socket.on("partnerLeft", () => {
        appendMessage("Partner has disconnected.");
        partner = null;
    });

    function appendMessage(msg) {
        const chatBox = document.getElementById("chatBox");
        const msgDiv = document.createElement("div");
        msgDiv.textContent = msg;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
