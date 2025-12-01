const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Books",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Rejected", "Returned"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);
