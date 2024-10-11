
import mongoose from 'mongoose';


const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    required: true 
  },
  ISBN: { 
    type: String, 
    unique: true, 
    required: true 
  },
  publicationDate: { 
    type: Date 
  },
  genre: { 
    type: String 
  },
  copies: { 
    type: Number, 
    default: 0 
  }
},{timestamps:true});

const Book = mongoose.model('book', bookSchema);
export default Book;