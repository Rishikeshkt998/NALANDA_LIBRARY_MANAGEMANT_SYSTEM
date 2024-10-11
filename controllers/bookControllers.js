import Book from "../models/bookModel.js";
import { validateBookInput } from "../validations/bookValidations.js";



export const addBook = async (req, res) => {
  const { title, author, ISBN, publicationDate, genre, copies } = req.body;

  const validationError = validateBookInput({ title, author, ISBN, publicationDate, genre, copies });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const book = new Book({
      title,
      author,
      ISBN,
      publicationDate,
      genre,
      copies,
    });

    await book.save();
    res.status(201).json({ message: "Book added successfully." });
  } catch (err) {
    console.error("Error adding book:", err); 
    res.status(500).json({ error: "Server error. Failed to add the book." });
  }
};

export const updateBook = async (req, res) => {
  const { title, author, ISBN, publicationDate, genre, copies } = req.body;
  const validationError = validateBookInput({ title, author, ISBN, publicationDate, genre, copies });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, ISBN, publicationDate, genre, copies },
      { new: true } 
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book updated successfully", book });
  } catch (err) {
    res.status(500).json({ error: "Failed to update the book. Please try again later." });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



export const listBooks = async (req, res) => {
  try {

    const { genre, author, title, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (genre) filter.genre = genre;
    if (author) filter.author = new RegExp(author, 'i');
    if (title) filter.title = new RegExp(title, 'i'); 

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const books = await Book.find(filter)
      .skip(skip)         
      .limit(pageSize);    

    const totalBooks = await Book.countDocuments(filter);

    res.json({
      books,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalBooks / pageSize),
      totalBooks,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};