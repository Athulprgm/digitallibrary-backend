const Message = require("../models/Message");
const User = require("../models/User");

// GET CHAT USERS
exports.getChatUsers = async (req, res) => {
  try {
    const loggedIn = req.user.id;
    const users = await User.find({ _id: { $ne: loggedIn } })
      .select("fullName email username photo")
      .lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET MESSAGES WITH USER
exports.getMessages = async (req, res) => {
  try {
    const user1 = req.user.id;
    const user2 = req.params.id;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 }).lean();

    await Message.updateMany(
      { receiver: user1, sender: user2, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.sendMessage = async (req, res) => {
  try {
    const sender = req.user.id;
    const receiver = req.params.id;

    if (!req.body.message) return res.status(400).json({ message: "Message required" });

    const newMsg = await Message.create({
      sender,
      receiver,
      message: req.body.message,
      read: false,
    });

    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
// GET UNREAD MESSAGE COUNT
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unread = await Message.countDocuments({
      receiver: userId,
      read: false
    });

    return res.json({ unread });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

