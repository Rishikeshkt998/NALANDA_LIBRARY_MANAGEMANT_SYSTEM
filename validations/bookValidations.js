export const validateBookInput = ({ title, author, ISBN, publicationDate, genre, copies }) => {
  if (!title || !author || !ISBN || !publicationDate || !genre || copies === undefined) {
    return "All fields are required.";
  }

  if (typeof title !== "string" || title.trim() === "") {
    return "Title must be a valid non-empty string.";
  }

  if (typeof author !== "string" || author.trim() === "") {
    return "Author must be a valid non-empty string.";
  }

  const isbnRegex = /^[0-9-]+$/; 
  if (!isbnRegex.test(ISBN)) {
    return "ISBN must be in a valid format (digits and hyphens only).";
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; 
  if (!dateRegex.test(publicationDate)) {
    return "Publication date must be in 'YYYY-MM-DD' format.";
  }

  if (typeof genre !== "string" || genre.trim() === "") {
    return "Genre must be a valid non-empty string.";
  }

  if (typeof copies !== "number" || copies < 0) {
    return "Copies must be a valid non-negative number.";
  }

  return null;  
};