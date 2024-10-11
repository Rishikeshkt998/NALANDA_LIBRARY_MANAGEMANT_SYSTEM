import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "book", 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
    required: true 
  },
  borrowedDate: { 
    type: Date, 
    default: Date.now 
  },
  returnedDate: { 
    type: Date 
  },
});

const Borrow = mongoose.model("borrow", borrowSchema);
export default Borrow;