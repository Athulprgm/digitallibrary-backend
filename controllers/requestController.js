const Request = require("../models/Request");
const Book = require("../models/Book");
const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.getRequests = async (req, res) => {
  try {
    const currentUserId = req.params.id;

    const requests = await Request.find()
      .populate({
        path: "bookId",
        populate: { path: "userId", select: "fullName email" },
      })
      .populate("userId", "fullName email")
      .sort({ _id: -1 });

    const receivedRequests = requests.filter(
      (r) =>
        r.bookId &&
        r.bookId.userId &&
        r.bookId.userId._id.toString() === currentUserId
    );

    const madeRequests = requests.filter(
      (r) => r.userId && r.userId._id.toString() === currentUserId
    );

    res.status(200).json({
      success: true,
      receivedRequests,
      madeRequests,
    });
  } catch (error) {
    console.log("GET REQUEST ERROR:", error);
    res.status(500).json({ success: false, message: "Error loading requests" });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const { bookId, message, userId } = req.body;

    const book = await Book.findById(bookId).populate(
      "userId",
      "fullName email"
    );
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (book.userId._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot request your own book",
      });
    }

    const request = await Request.create({
      bookId,
      message,
      userId,
      status: "Pending",
    });

    await Book.findByIdAndUpdate(bookId, { status: "Pending" });

    try {
      const imagePath = path.join(process.cwd(), book.image);
      const fileExt = path.extname(book.image) || ".jpg";
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: book.userId.email, // owner
        subject: "New Book Request Received",
        html: `
          <h2>Hello ${book.userId.fullName},</h2>
          <p>You received a new request for your book:</p>

          <h3>${book.title}</h3>

          ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}

          <p>Please open your dashboard to accept or reject the request.</p>
          <img src="cid:bookImage" style="width:200px;border-radius:10px;" />
          <br>
          <p>Thank you!</p>
        `,
        attachments: [
          {
            filename: `${book.title}${fileExt}`,
            path: imagePath,
            cid: "bookImage",
          },
        ],
      });
    } catch (emailErr) {
      console.log("REQUEST EMAIL ERROR:", emailErr);
    }

    res.status(201).json({ success: true, request });
  } catch (error) {
    console.log("CREATE REQUEST ERROR:", error);
    res.status(500).json({ success: false, message: "Error creating request" });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Request.findById(requestId)
      .populate("userId", "fullName email")
      .populate({
        path: "bookId",
        populate: { path: "userId", select: "fullName email" },
      });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const borrower = request.userId;
    const book = request.bookId;

    try {
      const imagePath = path.join(process.cwd(), book.image);
      const fileExt = path.extname(book.image) || ".jpg";
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: borrower.email,
        subject: "Your Book Request Has Been Accepted",
        html: `
          <h2>Hello ${borrower.fullName},</h2>
          <p>Your request for <strong>${book.title}</strong> has been <strong>ACCEPTED</strong>.</p>
          <p>You may now contact the owner to collect the book.</p>

          <h3>Book Image:</h3>
          <img src="cid:bookImage" style="width:200px;border-radius:10px;" />

          <br><br>
          <p>Thank you!</p>
        `,
        attachments: [
          {
            filename: `${book.title}${fileExt}`,
            path: imagePath,
            cid: "bookImage",
          },
        ],
      });
    } catch (mailError) {
      console.log("EMAIL SEND ERROR:", mailError);
    }

    await Request.findByIdAndUpdate(requestId, { status: "Accepted" });
    await Book.findByIdAndUpdate(book._id, { status: "Borrowed" });

    res.status(200).json({
      success: true,
      message: "Request accepted and email sent",
    });
  } catch (error) {
    console.log("ACCEPT REQUEST ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error accepting request",
    });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    await Request.findByIdAndUpdate(req.params.id, { status: "Rejected" });
    await Book.findByIdAndUpdate(request.bookId, { status: "Available" });

    res.status(200).json({ success: true, message: "Request rejected" });
  } catch (error) {
    console.log("REJECT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting request",
    });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { bookId } = req.body;

    await Request.findByIdAndUpdate(requestId, { status: "Returned" });
    await Book.findByIdAndUpdate(bookId, { status: "Available" });

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
    });
  } catch (error) {
    console.log("RETURN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error returning book",
    });
  }
};
