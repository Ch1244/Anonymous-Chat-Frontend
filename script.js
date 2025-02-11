const socket = io("http://localhost:3000");

// ✅ Ensure Elements Exist
document.addEventListener("DOMContentLoaded", () => {
    const usernameContainer = document.getElementById("username-container");
    const usernameInput = document.getElementById("username-input");
    const usernameBtn = document.getElementById("username-btn");

    const chatContainer = document.getElementById("chat-container");
    const chatBox = document.getElementById("chat-box");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
    const newChatBtn = document.getElementById("new-chat");
    const buyUnlimitedBtn = document.getElementById("buy-unlimited");
    const typingIndicator = document.getElementById("typing-indicator");
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    let username = localStorage.getItem("username");
    let chatCount = localStorage.getItem("chatCount") || 0;
    const freeChatLimit = 6;
    const isPaidUser = localStorage.getItem("isPaidUser") === "true";

    // ✅ Fix: Ensure "Start Chat" Button Works
    usernameBtn.addEventListener("click", () => {
        username = usernameInput.value.trim();

        if (username) {
            localStorage.setItem("username", username);
            socket.emit("setUsername", { username });

            usernameContainer.style.display = "none";
            chatContainer.style.display = "block";
        } else {
            alert("Please enter a valid username!");
        }
    });

    // ✅ Fix: Ensure "Send Message" Works
    sendBtn.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message && username) {
            socket.emit("message", { username, message });
            chatBox.innerHTML += `<p class="chat-message user-message"><strong>${username}:</strong> ${message}</p>`;
            messageInput.value = "";
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });

    socket.on("message", (data) => {
        chatBox.innerHTML += `<p class="chat-message stranger-message"><strong>${data.username || "Stranger"}:</strong> ${data.message}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    // ✅ Fix: Typing Indicator
    messageInput.addEventListener("input", () => {
        if (username) {
            socket.emit("typing");
        }
    });

    socket.on("typing", (name) => {
        typingIndicator.innerText = `${name} is typing...`;
        typingIndicator.style.display = "block";
        setTimeout(() => {
            typingIndicator.style.display = "none";
        }, 2000);
    });

    // ✅ Fix: Ensure "Dark Mode" Button Works
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
        localStorage.setItem("darkMode", mode);
        darkModeToggle.innerText = mode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    });

    // ✅ Fix: Load Dark Mode Preference
    if (localStorage.getItem("darkMode") === "dark") {
        document.body.classList.add("dark-mode");
        darkModeToggle.innerText = "☀️ Light Mode";
    }

    // ✅ Fix: Ensure "New Chat" Button Works
    newChatBtn.addEventListener("click", () => {
        window.location.reload();
    });

    // ✅ Fix: Ensure Payment Button Works
    if (!isPaidUser && chatCount >= freeChatLimit) {
        buyUnlimitedBtn.style.display = "block";
        buyUnlimitedBtn.addEventListener("click", async () => {
            const response = await fetch("/create-checkout-session", { method: "POST" });
            const data = await response.json();
            window.location.href = data.url;
        });
    }
});
