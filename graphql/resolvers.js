

import Book from '../models/bookModel.js';
import Borrow from '../models/borrowModel.js';
import User from '../models/userModel.js';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';
import { validateEmail,validatePassword } from '../validations/validations.js';



export const resolvers = {
  Query: {
    async getUsers(_, __, { req }) {
      if (!req.user || req.user.role !== "Admin") {
        throw new Error("Unauthorized");
      }
      return await User.find();
    },

    async getUser(_, { id }, { req }) {
      if (!req.user) {
        throw new Error("Unauthorized");
      }
      const user = await User.findById(id).populate("borrowedBooks");
      return user;
    },
    async listBooks(_, {  author, genre, page = 1, limit = 10 }) {
      try {
        const filter = {};
        if (genre) filter.genre = genre;
        if (author) filter.author = new RegExp(author, 'i');

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        const books = await Book.find(filter).skip(skip).limit(pageSize);
        const totalBooks = await Book.countDocuments(filter);

        return {
          books,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalBooks / pageSize),
          totalBooks,
        };
      } catch (err) {
        throw new Error(err.message);
      }
    },

    async mostBorrowedBooks() {
      try {
        const mostBorrowed = await Borrow.aggregate([
          { $group: { _id: '$bookId', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: 'books',
              localField: '_id',
              foreignField: '_id',
              as: 'book',
            },
          },
          { $unwind: '$book' },
          {
            $project: {
              bookId: '$book',
              count: '$count',
            },
          },
        ]);
        return mostBorrowed;
      } catch (err) {
        throw new Error(err.message);
      }
    },

    async activeMembers() {
      try {
        const activeMembers = await Borrow.aggregate([
          { $group: { _id: '$userId', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'user',
            },
          },
          { $unwind: '$user' },
          {
            $project: {
              userId: '$user',
              count: '$count',
            },
          },
        ]);
        return activeMembers;
      } catch (err) {
        throw new Error(err.message);
      }
    },

    async availableBooks() {
      try {
        const books = await Book.find({}, 'title copies');
        return books;
      } catch (err) {
        throw new Error(err.message);
      }
    },

  async borrowHistory(_, __, { req }){
      if (!req.user) {
        throw new Error("Unauthorized");
      }
      const userId = req.user.id;
      return await Borrow.find({ userId }).populate("bookId");
    },
//   async borrowHistory(_, __, { req }) {
//   if (!req.user) {
//     throw new Error("Unauthorized");
//   }

//   const userId = req.user.id;

//   try {

//     const borrows = await Borrow.find({ userId }).populate("bookId");

//     return borrows.map(borrow => ({
//       borrowId: borrow._id,           
//       bookId: borrow.bookId,         
//       borrowDate: borrow.borrowedDate,   
//       returnedDate: borrow.returnedDate 
//     }));
//   } catch (error) {
//     console.error("Error fetching borrow history:", error);
//     throw new Error("An error occurred while fetching borrow history");
//   }
// }
  },
  

  Mutation: {
    async userSignup(_, { name, email, password}) {
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }

      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!validatePassword(password)) {
        throw new Error(
          'Password must be at least 8 characters long, include at least one letter and one number'
        );
      }


      try {
        const userExisted = await User.findOne({ email });
        if (userExisted) {
          throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });

        await user.save();
        return { message: 'User registered successfully' ,user};
      } catch (error) {
        console.log(error)
        throw new Error('Server error. Please try again later.');
      }
    },

    async userLogin(_, { email, password }) {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '1h' }
        );

        user.password = undefined;

        return { message: 'Login successful', user, token };
      } catch (error) {
        throw new Error('Server error. Please try again later.');
      }
    },

    async addBook(_, { input }) {
      const { title, author, ISBN, publicationDate, genre, copies } = input;

      const validationError = validateBookInput({ title, author, ISBN, publicationDate, genre, copies });
      if (validationError) {
        throw new Error(validationError);
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
        return { message: "Book added successfully." ,book}
      } catch (err) {
        console.log(err)
        throw new Error('Server error. Failed to add the book.');
      }
    },

    async updateBook(_, { id, input }) {
      const validationError = validateBookInput(input);
      if (validationError) {
        throw new Error(validationError);
      }

      try {
        const book = await Book.findByIdAndUpdate(id, input, { new: true });
        if (!book) {
          throw new Error('Book not found');
        }

        return book;
      } catch (err) {
        throw new Error('Failed to update the book. Please try again later.');
      }
    },

    async deleteBook(_, { id }) {
      try {
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
          throw new Error('Book not found');
        }
        return 'Book deleted';
      } catch (err) {
        throw new Error(err.message);
      }
    },
async borrowBook(_, { input }, { req }) {
  const { bookId } = input;

  if (!req.user) {
    throw new Error("Unauthorized");
  }

  const userId = req.user.id; 

  try {
    const book = await Book.findById(bookId);
    console.log("book", book);
    
    if (!book) {
      throw new Error("Book not found");
    }

    if (book.copiesAvailable <= 0) {
      throw new Error("No copies available");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.books.includes(bookId)) {
      throw new Error("You have already borrowed this book");
    }

    const borrow = new Borrow({
      bookId,
      userId,
      borrowDate: new Date(), 
    });

    book.copiesAvailable -= 1; 
    user.books.push(bookId); 

    await Promise.all([book.save(), user.save(), borrow.save()]);

    return "Book borrowed successfully";
  } catch (error) {
    console.error("BorrowBook Error: ", error);
    throw new Error("An error occurred while borrowing the book");
  }
},


    async returnBook(_, { borrowId }) {
      try {
        const borrow = await Borrow.findById(borrowId);
        if (!borrow || borrow.returnedDate) {
          throw new Error('Invalid or already returned borrow record');
        }

        const book = await Book.findById(borrow.bookId);
        if (!book) {
          throw new Error('Book not found');
        }

        borrow.returnedDate = new Date();
        await borrow.save();

        book.copies += 1;
        await book.save();

        return 'Book returned';
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

const validateBookInput = ({ title, author, ISBN, publicationDate, genre, copies }) => {
  if (!title || !author || !ISBN || !publicationDate || !genre || copies === undefined) {
    return "All fields are required.";
  }

  if (typeof title !== "string" || title.trim() === "") {
    return "Title must be a valid non-empty string.";
  }

  if (typeof author !== "string" || author.trim() === "") {
    return "Author must be a valid non-empty string.";
  }

  if (typeof ISBN !== "string" || ISBN.trim() === "") {
    return "ISBN must be a valid non-empty string.";
  }

  if (typeof publicationDate !== "string" || isNaN(Date.parse(publicationDate))) {
    return "Publication date must be a valid date string.";
  }

  if (typeof genre !== "string" || genre.trim() === "") {
    return "Genre must be a valid non-empty string.";
  }

  if (typeof copies !== "number" || copies < 0) {
    return "Copies must be a non-negative integer.";
  }

  return null;
};
