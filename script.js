const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://randomchatt.netlify.app",
    methods: ["GET", "POST"],
  },
});

let waitingUser = null;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (username) => {
    socket.username = username;
    if (waitingUser) {
      // Pair the new user with the waiting user
      io.to(socket.id).emit("message", { from: "System", message: `Connected to ${waitingUser.username}` });
      io.to(waitingUser.id).emit("message", { from: "System", message: `Connected to ${socket.username}` });

      socket.partner = waitingUser.id;
      waitingUser.partner = socket.id;

      io.to(socket.id).emit("partner", waitingUser.id);
      io.to(waitingUser.id).emit("partner", socket.id);

      waitingUser = null;
    } else {
      waitingUser = socket;
    }
  });

  socket.on("message", (message) => {
    if (socket.partner) {
      io.to(socket.partner).emit("message", { from: socket.username, message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (waitingUser && waitingUser.id === socket.id) {
      waitingUser = null;
    }
    if (socket.partner) {
      io.to(socket.partner).emit("message", { from: "System", message: "Your partner has disconnected." });
      io.to(socket.partner).emit("partner", null);
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
