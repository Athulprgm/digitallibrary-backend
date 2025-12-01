const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("./models/Message");

let io;
const onlineUsers = new Map(); // userId -> socketId

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers.set(socket.userId, socket.id);

    socket.on("send-message", async (data) => {
      if (!data.receiver) return;

      const newMsg = await Message.create({
        sender: socket.userId,
        receiver: data.receiver,
        message: data.message,
        read: false,
      });

      // receiver gets message
      const receiverSocket = onlineUsers.get(data.receiver);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive-message", newMsg);
      }

      // sender gets message
      socket.emit("receive-message", newMsg);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId);
    });
  });
}

module.exports = { initSocket };
