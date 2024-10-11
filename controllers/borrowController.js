import Book from "../models/bookModel.js";
import Borrow from "../models/borrowModel.js";
import User from "../models/userModel.js";

export const borrowBook = async (req, res) => {
  const { bookId } = req.body;

  try {
    if (!bookId) {
      return res.status(400).json({ error: "Book ID is required" });
    }
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    if (book.copies <= 0) {
      return res.status(400).json({ error: "No copies available" });
    }

    const user = await User.findById(req.user.id);
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    if (user.books.includes(bookId)) {
      return res.status(400).json({ error: "You have already borrowed this book" });
    }

    const borrow = new Borrow({
      bookId,
      userId: user._id,
      borrowDate: new Date(), 
    });

    await borrow.save();

    book.copies -= 1;
    await book.save();

    user.books.push(bookId);
    await user.save();

    res.status(200).json({ message: "Book borrowed successfully" });

  } catch (err) {

    console.error("BorrowBook Error: ", err);
    res.status(500).json({ error: "An error occurred while borrowing the book" });
  }
};

export const returnBook = async (req, res) => {
  const { borrowId } = req.body;
  try {
    const borrow = await Borrow.findById(borrowId);
    if (!borrow || borrow.returnedDate) {
      return res.status(400).json({ error: "Invalid or already returned borrow record" });
    }

    const book = await Book.findById(borrow.bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const user = await User.findById(borrow.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    borrow.returnedDate = new Date();
    await borrow.save();

    book.copies += 1;
    await book.save();

    user.books= user.books.filter(
      (b) => b.toString() !== book._id.toString()
    );
    await user.save();

    res.json({ message: "Book returned" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const borrowHistory = async (req, res) => {
  try {
    const borrows = await Borrow.find({ userId: req.user.id }).populate("bookId");
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};