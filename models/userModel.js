import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["Admin", "Member"], 
    default: "Member" 
  },
  books: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "book" 
  }],
});

const User = mongoose.model("user", userSchema);
export default User;